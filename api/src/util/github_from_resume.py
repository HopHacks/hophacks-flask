"""Pull a GitHub profile URL out of resume bytes or free text."""

from __future__ import annotations

import io
import re
import zipfile

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


def github_url_from_text(text):
    """First github.com/<user> in text, or None."""
    if not text:
        return None
    cleaned = (
        str(text)
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


def github_url_from_resume_bytes(data, filename=""):
    """Scan PDF/DOCX/plain bytes for a GitHub profile URL."""
    if not data:
        return None
    name = (filename or "").lower()
    chunks = []

    if data[:4] == b"%PDF" or name.endswith(".pdf"):
        chunks.append(data.decode("latin-1", errors="ignore"))

    if data[:2] == b"PK" or name.endswith(".docx"):
        try:
            with zipfile.ZipFile(io.BytesIO(data)) as archive:
                for entry in archive.namelist():
                    if entry.startswith("word/") and entry.endswith(".xml"):
                        chunks.append(
                            archive.read(entry).decode("utf-8", errors="ignore")
                        )
        except (zipfile.BadZipFile, KeyError, RuntimeError):
            pass

    chunks.append(data.decode("utf-8", errors="ignore"))
    chunks.append(data.decode("latin-1", errors="ignore"))

    for chunk in chunks:
        url = github_url_from_text(chunk)
        if url:
            return url
    return None
