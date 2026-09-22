document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM 주요 요소 가져오기
    const resumeForm = document.getElementById('resumeForm');
    const generateBtn = document.getElementById('generateBtn');
    const btnText = generateBtn.querySelector('.btn-text');

    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const loadingStatus = document.getElementById('loadingStatus');
    const resultContent = document.getElementById('resultContent');
    const actionButtons = document.getElementById('actionButtons');
    const errorAlert = document.getElementById('errorAlert');

    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // 생성된 마크다운 내용을 보관하는 전역 변수
    let currentMarkdownContent = "";

    // 2. 사용자 친화적 에러 메시지 표시 함수
    function showError(message) {
        errorAlert.textContent = message;
        errorAlert.classList.remove('hidden');
        loadingStatus.classList.add('hidden');
        resultPlaceholder.classList.remove('hidden');
        resultContent.classList.add('hidden');
        actionButtons.classList.add('hidden');
    }

    // 에러 메시지 초기화 함수
    function clearError() {
        errorAlert.textContent = "";
        errorAlert.classList.add('hidden');
    }

    // 3. 폼 제출(생성 버튼 클릭) 이벤트 핸들러
    resumeForm.addEventListener('submit', async (e) => {
        // 기본 폼 제출(페이지 새로고침) 방지
        e.preventDefault();
        clearError();

        // 입력값 가져오기
        const name = document.getElementById('name').value.trim();
        const jobTitle = document.getElementById('job_title').value.trim();
        const tone = document.getElementById('tone').value;
        const promptType = document.querySelector('input[name="prompt_type"]:checked').value;
        const experience = document.getElementById('experience').value.trim();
        const projects = document.getElementById('projects').value.trim();

        // [Frontend 입력 검증] 필수 입력값 누락 확인
        if (!name || !jobTitle || !experience || !projects) {
            showError("모든 필수 항목(이름, 지원 직무, 경력 사항, 프로젝트 경험)을 입력해 주세요.");
            return;
        }

        // [Loading 상태 표시] 버튼 비활성화 및 로딩 스피너 작동
        generateBtn.disabled = true;
        btnText.textContent = "⏳ AI가 이력서를 작성하고 있습니다...";

        resultPlaceholder.classList.add('hidden');
        resultContent.classList.add('hidden');
        actionButtons.classList.add('hidden');
        loadingStatus.classList.remove('hidden');

        try {
            // [비동기 API 요청] Flask 백엔드의 /generate 라우트로 데이터 전송
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    job_title: jobTitle,
                    tone: tone,
                    prompt_type: promptType,
                    experience: experience,
                    projects: projects
                })
            });

            const data = await response.json();

            // 백엔드 에러 응답 처리
            if (!response.ok || !data.success) {
                throw new Error(data.error || "이력서 생성 중 오류가 발생했습니다. 다시 시도해 주세요.");
            }

            // [결과 출력] 생성된 마크다운 텍스트 렌더링
            currentMarkdownContent = data.content;
            resultContent.textContent = currentMarkdownContent;

            loadingStatus.classList.add('hidden');
            resultContent.classList.remove('hidden');
            actionButtons.classList.remove('hidden');

        } catch (err) {
            console.error("API 요청 실패:", err);
            showError(err.message);
        } finally {
            // 버튼 상태 원상복구
            generateBtn.disabled = false;
            btnText.textContent = "✨ AI로 이력서 & 포트폴리오 생성";
        }
    });

    // 4. 결과 복사 기능 (클립보드 복사)
    copyBtn.addEventListener('click', async () => {
        if (!currentMarkdownContent) return;

        try {
            await navigator.clipboard.writeText(currentMarkdownContent);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ 복사 완료!";
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error("복사 실패:", err);
            alert("클립보드 복사에 실패했습니다. 마우스로 드래그하여 직접 복사해 주세요.");
        }
    });

    // 5. 마크다운(.md) 파일 다운로드 기능
    downloadBtn.addEventListener('click', () => {
        if (!currentMarkdownContent) return;

        const name = document.getElementById('name').value.trim() || "resume";
        const filename = `${name}_이력서_포트폴리오.md`;

        // 마크다운 데이터를 텍스트 파일(Blob) 형태로 생성
        const blob = new Blob([currentMarkdownContent], { type: 'text/markdown;charset=utf-8;' });
        const downloadUrl = URL.createObjectURL(blob);

        // 가상의 다운로드 링크를 만들어 자동 클릭
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // 다운로드 완료 후 정리
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    });
});
