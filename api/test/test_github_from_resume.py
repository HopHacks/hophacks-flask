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
    assert github_url_from_text("https://github.com/googlefonts") is None
    assert github_url_from_text("https://github.com/...") is None


def test_github_url_from_pages_and_ssh():
    assert (
        github_url_from_text("http://dakg17.github.io")
        == "https://github.com/dakg17"
    )
    assert (
        github_url_from_text("git@github.com:octocat/hello.git")
        == "https://github.com/octocat"
    )
    assert (
        github_url_from_text("github . com / octocat")
        == "https://github.com/octocat"
    )


def test_github_url_strips_glued_https_and_kerning_split():
    assert (
        github_url_from_text(
            "https://github.com/amiezenghttps://github.com/amiezeng"
        )
        == "https://github.com/amiezeng"
    )
    # Kerning splits the username across two PDF literal strings.
    assert (
        github_url_from_resume_bytes(
            b"%PDF-1.4\n[-260(github.com/r)20(edbbean)]TJ\n%%EOF",
            "resume.pdf",
        )
        == "https://github.com/redbbean"
    )
    assert (
        github_url_from_text("https://github.com/t1\x0bnyw")
        == "https://github.com/t1nyw"
    )


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


def _flate_pdf(*stream_payloads):
    parts = [b"%PDF-1.4\n"]
    for i, payload in enumerate(stream_payloads, 1):
        compressed = zlib.compress(payload)
        header = "<< /Filter /FlateDecode /Length {} >>\nstream\n".format(
            len(compressed)
        ).encode("ascii")
        parts.append(
            "{} 0 obj\n".format(i).encode("ascii")
            + header
            + compressed
            + b"\nendstream\nendobj\n"
        )
    parts.append(b"%%EOF")
    return b"".join(parts)


def test_github_url_from_pdf_tounicode_cids():
    cmap = """
begincmap
15 beginbfchar
<0001> <0067>
<0002> <0069>
<0003> <0074>
<0004> <0068>
<0005> <0075>
<0006> <0062>
<0007> <002E>
<0008> <0063>
<0009> <006F>
<000A> <006D>
<000B> <002F>
<000C> <0075>
<000D> <0073>
<000E> <0065>
<000F> <0072>
endbfchar
endcmap
""".encode("ascii")
    # CID font draws "github.com/user" as 2-byte glyph ids, not ASCII.
    content = b" ".join(
        "<{:04X}> Tj".format(cid).encode("ascii") for cid in range(1, 16)
    )
    blob = _flate_pdf(cmap, content)
    assert github_url_from_resume_bytes(blob, "resume.pdf") == "https://github.com/user"
