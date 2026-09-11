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
    for stream in _inflated_pdf_streams(data):
        chunks.extend(_decode_bytes(stream))
        chunks.extend(_pdf_hex_uris(stream))
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
