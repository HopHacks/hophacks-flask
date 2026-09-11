import sys
sys.path.append("../src")

import io
import zipfile

from util.github_from_resume import github_url_from_resume_bytes, github_url_from_text


def test_github_url_from_profile_text():
    assert (
        github_url_from_text("https://github.com/octocat")
        == "https://github.com/octocat"
    )
    assert (
        github_url_from_text("see github.com/octocat/hello-world")
        == "https://github.com/octocat"
    )


def test_github_url_skips_reserved_paths():
    assert github_url_from_text("https://github.com/login") is None
    assert github_url_from_text("https://github.com/features") is None


def test_github_url_from_pdf_bytes():
    blob = b"%PDF-1.4\n/URI (https://github.com/octocat)\n%%EOF"
    assert github_url_from_resume_bytes(blob, "resume.pdf") == "https://github.com/octocat"


def test_github_url_from_docx_bytes():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as archive:
        archive.writestr(
            "word/document.xml",
            '<?xml version="1.0"?><w:t>https://github.com/octocat</w:t>',
        )
    assert (
        github_url_from_resume_bytes(buf.getvalue(), "resume.docx")
        == "https://github.com/octocat"
    )


def test_github_url_missing():
    assert github_url_from_resume_bytes(b"%PDF-1.4 no links", "x.pdf") is None
    assert github_url_from_text("") is None
