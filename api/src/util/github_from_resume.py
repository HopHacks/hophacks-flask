"""Pull a GitHub profile URL out of resume bytes or free text."""

from __future__ import annotations

import io
import re
import zipfile
import zlib

# Username only — repo paths still yield the profile. Skip GitHub's own
# marketing / auth routes so "github.com/login" does not become a handle.
GITHUB_RE = re.compile(
    r"(?:https?://)?(?:www\.)?github\.com/"
    r"([A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?)"
    r"(?:/[^\s\"'<>)\\]]*)?",
    re.IGNORECASE,
)

_SKIP_USERS = {
    "about",
    "account",
    "apps",
    "auth",
    "codespaces",
    "collections",
    "copilot",
    "customer-stories",
    "enterprise",
    "enterprises",
    "events",
    "explore",
    "features",
    "github",
    "issues",
    "join",
    "login",
    "marketplace",
    "new",
    "notifications",
    "org",
    "organizations",
    "orgs",
    "pricing",
    "pulls",
    "readme",
    "resources",
    "search",
    "security",
    "sessions",
    "settings",
    "site",
    "solutions",
    "sponsors",
    "team",
    "topics",
}

# Visible text is often just "GitHub"; the URL lives on the annotation.
_PDF_STREAM_RE = re.compile(br"stream\r?\n(.*?)\r?\nendstream", re.DOTALL)
_PDF_HEX_URI_RE = re.compile(br"/URI\s*<([0-9A-Fa-f\s]+)>")
_PDF_BFCHAR_RE = re.compile(r"\d+\s+beginbfchar(.*?)endbfchar", re.S | re.I)
_PDF_BFRANGE_RE = re.compile(r"\d+\s+beginbfrange(.*?)endbfrange", re.S | re.I)
_PDF_HEX_TJ_RE = re.compile(r"<([0-9A-Fa-f\s]+)>\s*Tj")
_PDF_TJ_ARRAY_RE = re.compile(r"\[(.*?)\]\s*TJ", re.S)
_PDF_HEX_RE = re.compile(r"<([0-9A-Fa-f\s]+)>")


def _utf16_hex_to_str(hexstr):
    cleaned = re.sub(r"\s+", "", hexstr)
    if len(cleaned) % 2:
        cleaned = "0" + cleaned
    try:
        raw = bytes.fromhex(cleaned)
    except ValueError:
        return ""
    if len(raw) % 2:
        raw = b"\x00" + raw
    return raw.decode("utf-16-be", errors="ignore")


def _parse_tounicode_cmap(text):
    """CID -> Unicode string from a ToUnicode CMap."""
    mapping = {}
    for block in _PDF_BFCHAR_RE.finditer(text):
        for match in re.finditer(
            r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", block.group(1)
        ):
            mapping[int(match.group(1), 16)] = _utf16_hex_to_str(match.group(2))
    for block in _PDF_BFRANGE_RE.finditer(text):
        body = block.group(1)
        for match in re.finditer(
            r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*\[([^\]]*)\]", body
        ):
            lo, hi = int(match.group(1), 16), int(match.group(2), 16)
            dests = re.findall(r"<([0-9A-Fa-f]+)>", match.group(3))
            for i, cid in enumerate(range(lo, hi + 1)):
                if i < len(dests):
                    mapping[cid] = _utf16_hex_to_str(dests[i])
        body = re.sub(
            r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*\[[^\]]*\]", "", body
        )
        for match in re.finditer(
            r"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", body
        ):
            lo, hi = int(match.group(1), 16), int(match.group(2), 16)
            start = bytes.fromhex(match.group(3))
            if len(start) % 2:
                start = b"\x00" + start
            if len(start) < 2:
                continue
            prefix, last = start[:-2], int.from_bytes(start[-2:], "big")
            for i, cid in enumerate(range(lo, hi + 1)):
                mapping[cid] = (prefix + (last + i).to_bytes(2, "big")).decode(
                    "utf-16-be", errors="ignore"
                )
    return mapping


def _hex_tj_payloads(text):
    """Raw CID bytes drawn by Tj / TJ operators."""
    payloads = []
    for match in _PDF_HEX_TJ_RE.finditer(text):
        hexstr = re.sub(r"\s+", "", match.group(1))
        if hexstr and len(hexstr) % 2 == 0:
            try:
                payloads.append(bytes.fromhex(hexstr))
            except ValueError:
                continue
    for arr in _PDF_TJ_ARRAY_RE.finditer(text):
        for match in _PDF_HEX_RE.finditer(arr.group(1)):
            hexstr = re.sub(r"\s+", "", match.group(1))
            if hexstr and len(hexstr) % 2 == 0:
                try:
                    payloads.append(bytes.fromhex(hexstr))
                except ValueError:
                    continue
    return payloads


def _decode_cids(payload, mapping, two_byte):
    if not payload or not mapping:
        return ""
    chars = []
    if two_byte:
        for i in range(0, len(payload) - 1, 2):
            cid = (payload[i] << 8) | payload[i + 1]
            chars.append(mapping.get(cid, ""))
    else:
        for byte in payload:
            chars.append(mapping.get(byte, ""))
    return "".join(chars)


def _pdf_tounicode_text(inflated_streams):
    """Rebuild visible text from CID fonts (github.com with no ASCII in the file)."""
    cmaps = []
    contents = []
    for payload in inflated_streams:
        text = payload.decode("latin-1", errors="ignore")
        if "begincmap" in text:
            mapping = _parse_tounicode_cmap(text)
            if mapping:
                cmaps.append(mapping)
        if "Tj" in text or "TJ" in text:
            contents.append(text)
    if not cmaps or not contents:
        return []

    blobs = []
    for text in contents:
        blobs.extend(_hex_tj_payloads(text))
    if not blobs:
        return []

    decoded = []
    for mapping in cmaps:
        decoded.append(
            "".join(_decode_cids(blob, mapping, True) for blob in blobs)
        )
        decoded.append(
            "".join(_decode_cids(blob, mapping, False) for blob in blobs)
        )
    return decoded


def github_url_from_text(text):
    """First github.com/<user> in text, or None."""
    if not text:
        return None
    cleaned = (
        str(text)
        .replace("\x00", "")
        .replace("&#x2F;", "/")
        .replace("&#47;", "/")
        .replace("&amp;", "&")
    )
    for match in GITHUB_RE.finditer(cleaned):
        user = match.group(1)
        if user.lower() in _SKIP_USERS:
            continue
        return "https://github.com/{}".format(user)
    return None


def _decode_bytes(data):
    """UTF-8, latin-1, and a null-stripped copy (PDF UTF-16 strings)."""
    chunks = [
        data.decode("utf-8", errors="ignore"),
        data.decode("latin-1", errors="ignore"),
    ]
    stripped = data.replace(b"\x00", b"")
    if stripped != data:
        chunks.append(stripped.decode("latin-1", errors="ignore"))
    return chunks


def _inflated_pdf_streams(data):
    """Decompress FlateDecode streams so /URI annotations become searchable."""
    inflated = []
    for match in _PDF_STREAM_RE.finditer(data):
        raw = match.group(1)
        for wbits in (zlib.MAX_WBITS, -zlib.MAX_WBITS):
            try:
                payload = zlib.decompress(raw, wbits)
            except zlib.error:
                continue
            if payload:
                inflated.append(payload)
            break
        if len(inflated) >= 48:
            break
    return inflated


def _pdf_hex_uris(data):
    """PDF /URI <hex> form used by some exporters instead of a literal string."""
    texts = []
    for match in _PDF_HEX_URI_RE.finditer(data):
        hexstr = re.sub(br"\s+", b"", match.group(1))
        try:
            texts.append(bytes.fromhex(hexstr.decode("ascii")).decode("utf-8", "ignore"))
        except ValueError:
            continue
    return texts


def _pdf_chunks(data):
    chunks = []
    chunks.extend(_decode_bytes(data))
    chunks.extend(_pdf_hex_uris(data))
    inflated = _inflated_pdf_streams(data)
    for stream in inflated:
        chunks.extend(_decode_bytes(stream))
        chunks.extend(_pdf_hex_uris(stream))
    chunks.extend(_pdf_tounicode_text(inflated))
    return chunks


def _docx_chunks(data):
    """Document XML plus .rels hyperlink targets (the usual 'GitHub' chip)."""
    chunks = []
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            for entry in archive.namelist():
                lower = entry.lower()
                if not (
                    lower.endswith(".xml")
                    or lower.endswith(".rels")
                ):
                    continue
                chunks.append(archive.read(entry).decode("utf-8", errors="ignore"))
    except (zipfile.BadZipFile, KeyError, RuntimeError):
        pass
    return chunks


def github_url_from_resume_bytes(data, filename=""):
    """Scan PDF/DOCX/plain bytes for a GitHub profile URL.

    Clickable links often store the URL in PDF URI annotations or DOCX
    relationship files while the visible text is just "GitHub".
    """
    if not data:
        return None
    name = (filename or "").lower()
    chunks = []

    if data[:4] == b"%PDF" or name.endswith(".pdf"):
        chunks.extend(_pdf_chunks(data))

    if data[:2] == b"PK" or name.endswith(".docx"):
        chunks.extend(_docx_chunks(data))

    chunks.extend(_decode_bytes(data))

    for chunk in chunks:
        url = github_url_from_text(chunk)
        if url:
            return url
    return None
