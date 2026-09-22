import sys
from pathlib import Path

# Vercel Serverless Function 환경에서 프로젝트 루트 경로를 sys.path에 추가
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app import app

class VercelPathMiddleware:
    """
    Vercel rewrite로 인해 전달되는 내부 목적지 경로(/api/index.py, /api/index 등)를
    사용자가 실제 요청한 원래 URL(/, /generate, /sw.js 등)로 정규화하는 WSGI 미들웨어
    """
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        forwarded_uri = environ.get('HTTP_X_FORWARDED_URI')
        if forwarded_uri:
            # Vercel이 전달한 원본 URI가 있는 경우 (예: / 또는 /generate)
            environ['PATH_INFO'] = forwarded_uri.split('?')[0]
        else:
            # 내부 rewrite로 인해 /api/index.py 등으로 전달된 경우 접두어 제거
            path = environ.get('PATH_INFO', '')
            for prefix in ['/api/index.py', '/api/index', '/api']:
                if path.startswith(prefix):
                    new_path = path[len(prefix):]
                    environ['PATH_INFO'] = new_path if new_path else '/'
                    break
        return self.wsgi_app(environ, start_response)

# Vercel 배포 시 미들웨어 적용
app.wsgi_app = VercelPathMiddleware(app.wsgi_app)
