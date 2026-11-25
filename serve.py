"""Local server for development: like `python -m http.server`, but the browser never reuses old files.

Why: the page is made of many small modules. A plain server lets the browser keep some of them,
so after an edit it can mix old and new files and break. Run: python serve.py [port]  (default 8000)
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")  # always fetch the current file
        super().end_headers()


if __name__ == "__main__":
    handler = partial(NoCacheHandler, directory=str(Path(__file__).parent))
    print(f"Serving on http://localhost:{PORT}")
    ThreadingHTTPServer(("", PORT), handler).serve_forever()
