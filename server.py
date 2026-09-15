from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
import os
ROOT=Path(__file__).resolve().parent
os.chdir(ROOT)
class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        p=urlparse(self.path).path
        if p=="/": self.path="/index.html"
        elif p.startswith("/chapter/"):
            try:n=int(p.rstrip("/").split("/")[-1])
            except:n=0
            if 1<=n<=6:self.path=f"/pages/chapter{n}.html"
        return super().do_GET()
    def end_headers(self):
        self.send_header("Cache-Control","no-store")
        super().end_headers()
if __name__=="__main__":
    print("恩聚共行｜完整活動流程 v5")
    print("http://127.0.0.1:5000")
    ThreadingHTTPServer(("127.0.0.1",5000),Handler).serve_forever()
