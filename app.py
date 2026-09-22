import os
import logging
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static')
)
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'default-dev-secret-key')

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sw.js')
def service_worker():
    return app.send_static_file('sw.js')


@app.route('/generate', methods=['POST'])
def generate():
    logger.info("=== [/generate] 새로운 AI 생성 요청 수신 ===")

    if not GEMINI_API_KEY or GEMINI_API_KEY.strip() == "" or GEMINI_API_KEY == "your_gemini_api_key_here":
        err_msg = ".env 파일에 유효한 GEMINI_API_KEY가 입력되지 않았습니다."
        logger.error(err_msg)
        return jsonify({"success": False, "error": err_msg}), 400

    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "요청 데이터가 없습니다."}), 400

    name = data.get('name', '').strip()
    job_title = data.get('job_title', '').strip()
    experience = data.get('experience', '').strip()
    projects = data.get('projects', '').strip()
    tone = data.get('tone', '전문적이고 신뢰감 있는').strip()
    prompt_type = data.get('prompt_type', 'A').strip()

    if not name or not job_title or not experience or not projects:
        return jsonify({"success": False, "error": "모든 필수 항목을 입력해 주세요."}), 400

    prompt = f"""
    지원자 이름: {name}
    지원 직무: {job_title}
    어조: {tone}
    경력 사항:
    {experience}
    주요 프로젝트:
    {projects}

    위 지원자의 정보를 바탕으로 멋진 이력서와 포트폴리오 초안을 마크다운 형식으로 작성해 주세요.
    """

    try:
        logger.info("Gemini API 호출 중 (gemini-3.6-flash)...")
        from google import genai
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
        )

        logger.info("Gemini API 응답 성공!")
        return jsonify({
            "success": True,
            "content": response.text
        })

    except Exception as e:
        logger.error(f"Gemini API 오류 발생: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "error": f"AI 생성 실패: {str(e)}"
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=True)
