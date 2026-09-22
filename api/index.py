import sys
from pathlib import Path

# Vercel Serverless Function 환경에서 프로젝트 루트 경로를 sys.path에 추가
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app import app

# Vercel은 'app' WSGI 객체를 진입점으로 사용합니다.
