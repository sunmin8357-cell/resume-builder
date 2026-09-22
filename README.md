# 📄 AI 이력서 & 포트폴리오 생성기 (AI Resume Builder)

Google Gemini AI를 활용하여 지원자의 기본 정보와 프로젝트 경험을 바탕으로 맞춤형 이력서 및 포트폴리오 초안을 마크다운(Markdown) 형식으로 자동 생성해 주는 웹 애플리케이션입니다.

---

## ✨ 주요 기능

- **지원자 정보 기반 생성**: 이름, 지원 직무, 경력 사항, 프로젝트 경험 등을 입력받아 최적화된 결과물 도출
- **맞춤형 톤앤매너 선택**: 
  - 전문적이고 신뢰감 있는
  - 열정적이고 도전적인
  - 간결하고 명확한
  - 친근하면서도 정중한
- **Google Gemini API 연동**: 최신 `google-genai` SDK 기반의 빠른 텍스트 생성
- **깔끔한 웹 UI**: 2열 그리드 레이아웃의 직관적인 입력 폼 및 결과 미리보기 화면 제공

---

## 🛠 기술 스택

- **Backend**: Python 3, Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI/LLM**: Google Gemini API (`google-genai`)
- **환경 변수 관리**: `python-dotenv`

---

## 📁 프로젝트 구조

```text
resume-builder/
├── app.py                 # Flask 백엔드 서버 및 API 핸들러
├── requirements.txt       # Python 의존성 패키지 목록
├── .env.example           # 환경 변수 설정 템플릿
├── .env                   # 환경 변수 설정 파일 (API 키 등, 비공개)
├── templates/
│   └── index.html         # 메인 웹 페이지 템플릿
├── static/
│   ├── css/
│   │   └── style.css      # UI 스타일시트
│   └── js/
│       └── main.js        # 프론트엔드 비동기 요청 및 이벤트 처리
└── venv/                  # Python 가상환경 폴더
```

---

## 🚀 시작하기

### 1. 사전 요구사항
- Python 3.10 이상
- [Google AI Studio](https://aistudio.google.com/)에서 발급받은 Gemini API 키

### 2. 가상환경 활성화 및 패키지 설치

PowerShell 또는 터미널에서 다음 명령어를 실행합니다:

```powershell
# 가상환경 활성화 (Windows PowerShell 기준)
.\venv\Scripts\Activate.ps1

# 패키지 설치 (최초 1회 또는 패키지 추가 시)
pip install -r requirements.txt
```

> **PowerShell 스크립트 실행 오류 발생 시**:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .\venv\Scripts\Activate.ps1
> ```

### 3. 환경 변수 설정 (`.env`)

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고(또는 `.env.example` 복사), 발급받은 Gemini API 키를 입력합니다:

```ini
# Google Gemini API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Flask 설정
FLASK_PORT=5000
FLASK_SECRET_KEY=dev-secret-key-change-in-production
```

### 4. 애플리케이션 실행

```powershell
python app.py
```

또는 가상환경 파이썬 직접 실행:

```powershell
.\venv\Scripts\python.exe app.py
```

서버가 실행되면 브라우저에서 아래 주소로 접속합니다:
👉 **http://127.0.0.1:5000**

---

## 💡 사용 방법

1. 브라우저에서 `http://127.0.0.1:5000`에 접속합니다.
2. 지원자 이름, 지원 직무, 선호하는 톤앤매너를 선택합니다.
3. 경력 사항 및 주요 프로젝트 경험을 작성합니다.
4. **[이력서 및 포트폴리오 생성하기]** 버튼을 클릭합니다.
5. 우측 결과 창에서 마크다운 형식으로 생성된 초안을 확인하고 복사하여 활용합니다.
