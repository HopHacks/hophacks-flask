import sys
sys.path.append("../src")

import io
import zipfile
import zlib

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


def test_github_url_from_pdf_flate_uri():
    payload = zlib.compress(b"/URI (https://github.com/streamuser)")
    blob = (
        b"%PDF-1.4\n1 0 obj\n<< /Filter /FlateDecode >>\nstream\n"
        + payload
        + b"\nendstream\nendobj\n%%EOF"
    )
    assert github_url_from_resume_bytes(blob, "resume.pdf") == "https://github.com/streamuser"


def test_github_url_from_pdf_hex_uri():
    hexed = "https://github.com/hexuser".encode("ascii").hex()
    blob = "%PDF-1.4\n/URI <{}>\n%%EOF".format(hexed).encode("ascii")
    assert github_url_from_resume_bytes(blob, "resume.pdf") == "https://github.com/hexuser"


def test_github_url_from_pdf_utf16_string():
    utf16 = "https://github.com/wideuser".encode("utf-16-be")
    blob = b"%PDF-1.4\n/URI (" + utf16 + b")\n%%EOF"
    assert github_url_from_resume_bytes(blob, "resume.pdf") == "https://github.com/wideuser"


def test_github_url_from_docx_hyperlink_rel():
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as archive:
        archive.writestr(
            "word/document.xml",
            '<?xml version="1.0"?><w:hyperlink r:id="rId5"><w:t>GitHub</w:t></w:hyperlink>',
        )
        archive.writestr(
            "word/_rels/document.xml.rels",
            '<?xml version="1.0"?>'
            "<Relationships>"
            '<Relationship Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink"'
            ' Target="https://github.com/reluser" TargetMode="External"/>'
            "</Relationships>",
        )
    assert (
        github_url_from_resume_bytes(buf.getvalue(), "resume.docx")
        == "https://github.com/reluser"
    )
