from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
from datetime import datetime, timezone
from threading import Lock
import json
import os

ROOT = Path(__file__).resolve().parent
COMMENTS_FILE = ROOT / "data" / "comments.json"
COMMENTS_LOCK = Lock()
MAX_BODY_BYTES = 8192
MAX_NAME_LENGTH = 20
MAX_MESSAGE_LENGTH = 300

os.chdir(ROOT)


def load_comments():
    try:
        data = json.loads(COMMENTS_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_comments(comments):
    COMMENTS_FILE.parent.mkdir(parents=True, exist_ok=True)
    temp_file = COMMENTS_FILE.with_suffix(".tmp")
    temp_file.write_text(
        json.dumps(comments, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    temp_file.replace(COMMENTS_FILE)


class Handler(SimpleHTTPRequestHandler):
    def send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/api/comments":
            with COMMENTS_LOCK:
                comments = load_comments()
            self.send_json({"comments": list(reversed(comments[-50:]))})
            return

        if path == "/":
            self.path = "/index.html"
        elif path.startswith("/chapter/"):
            try:
                chapter = int(path.rstrip("/").split("/")[-1])
            except ValueError:
                chapter = 0
            if 1 <= chapter <= 6:
                self.path = f"/pages/chapter{chapter}.html"

        return super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if path != "/api/comments":
            self.send_json({"error": "Not found"}, status=404)
            return

        content_type = self.headers.get("Content-Type", "")
        if "application/json" not in content_type:
            self.send_json({"error": "Content-Type 必須是 application/json"}, status=415)
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            content_length = 0

        if content_length <= 0 or content_length > MAX_BODY_BYTES:
            self.send_json({"error": "留言資料大小不正確。"}, status=400)
            return

        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json({"error": "留言格式不正確。"}, status=400)
            return

        if not isinstance(payload, dict):
            self.send_json({"error": "留言格式不正確。"}, status=400)
            return

        name = str(payload.get("name", "")).strip()
        message = str(payload.get("message", "")).strip()

        if not name or not message:
            self.send_json({"error": "請填寫暱稱和留言內容。"}, status=400)
            return
        if len(name) > MAX_NAME_LENGTH:
            self.send_json({"error": f"暱稱最多 {MAX_NAME_LENGTH} 個字元。"}, status=400)
            return
        if len(message) > MAX_MESSAGE_LENGTH:
            self.send_json({"error": f"留言最多 {MAX_MESSAGE_LENGTH} 個字元。"}, status=400)
            return

        comment = {
            "name": name,
            "message": message,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        with COMMENTS_LOCK:
            comments = load_comments()
            comments.append(comment)
            comments = comments[-500:]
            save_comments(comments)

        self.send_json({"comment": comment}, status=201)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    print("恩聚共行｜完整活動流程 v6 + 留言功能")
    print("http://127.0.0.1:5000")
    ThreadingHTTPServer(("127.0.0.1", 5000), Handler).serve_forever()
