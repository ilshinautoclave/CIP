<html>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>일신오토클레이브 - ISOSTATIC PRESS 기술자료</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        /* 기본 스타일 설정 */
        :root {
            --primary-blue: #2a439c; /* 요청하신 포인트 컬러 */
            --accent-blue: #4facfe;   /* 그라데이션용 보조 컬러 */
            --bg-color: #111113;      /* 다크 배경색 */
            --card-bg: #1e1e21;       /* 카드 배경색 */
            --text-main: #ffffff;
            --text-sub: #a0a0a5;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.6;
            overflow-x: hidden;
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 40px;
        }

        /* 상단 헤더 영역 */
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 40px;
            background-color: rgba(17, 17, 19, 0.95);
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 25px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 800;
            font-size: 1.3rem;
            text-decoration: none;
            color: white;
        }

        .logo-mark {
            background-color: var(--primary-blue);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.9rem;
        }

        .search-box {
            background-color: #252529;
            border: 1px solid #333338;
            padding: 8px 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-sub);
            width: 280px;
        }

        .search-box span { font-size: 0.9rem; }
        .search-key { 
            border: 1px solid #444; 
            padding: 1px 6px; 
            border-radius: 4px; 
            font-size: 0.7rem; 
            margin-left: auto;
        }

        nav ul {
            display: flex;
            list-style: none;
            gap: 25px;
        }

        nav a {
            color: var(--text-sub);
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            transition: color 0.3s;
        }

        nav a:hover, nav a.active { color: white; }
        nav a.active { color: var(--primary-blue); font-weight: 700; }

        .header-right {
            display: flex;
            align-items: center;
            gap: 20px;
            color: var(--text-sub);
            font-size: 1.1rem;
        }

        /* 히어로 섹션 */
        .hero {
            padding: 100px 0 60px;
            position: relative;
        }

        /* 요청사항: 로고 부분 그라데이션 적용 */
        .hero-title-brand {
            font-size: 4rem;
            font-weight: 800;
            margin-bottom: 5px;
            background: linear-gradient(to right, var(--primary-blue), var(--accent-blue));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
        }

        .hero h1 {
            font-size: 3.5rem;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 25px;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--text-sub);
            max-width: 650px;
            margin-bottom: 45px;
        }

        /* 버튼 영역 */
        .hero-buttons {
            display: flex;
            gap: 15px;
            z-index: 10;
            position: relative;
        }

        .btn {
            padding: 12px 30px;
            border-radius: 35px;
            font-size: 1.1rem;
            font-weight: 700;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            transition: transform 0.2s, opacity 0.2s;
        }

        .btn:hover { transform: translateY(-2px); opacity: 0.9; }

        .btn-primary { background-color: #e63946; color: white; } /* 강조용 레드 */
        .btn-secondary { background-color: #2d2d32; color: white; }

        /* 배경 이미지 (장비) */
        .hero-device-img {
            position: absolute;
            right: -50px;
            top: 50%;
            transform: translateY(-40%);
            width: 750px;
            opacity: 0.9;
            z-index: 1;
            pointer-events: none;
        }

        /* 특징 카드 영역 */
        .features {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-top: 60px;
            padding-bottom: 80px;
        }

        .feature-card {
            background-color: var(--card-bg);
            padding: 30px;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.03);
            transition: border-color 0.3s;
        }

        .feature-card:hover { border-color: var(--primary-blue); }

        .icon-wrap {
            width: 45px;
            height: 45px;
            background-color: #2a2a2f;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            color: var(--primary-blue);
            font-size: 1.3rem;
        }

        .feature-card h3 {
            font-size: 1.15rem;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .feature-card p {
            font-size: 0.95rem;
            color: var(--text-sub);
            line-height: 1.6;
        }

        /* 패밀리 사이트 푸터 */
        .family-sites {
            padding: 60px 0;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
        }

        .family-sites h2 {
            font-size: 1.5rem;
            color: var(--text-sub);
            margin-bottom: 40px;
            font-weight: 600;
            letter-spacing: 2px;
        }

        .site-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            max-width: 900px;
            margin: 0 auto;
        }

        .site-item {
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
            text-decoration: none;
            font-weight: 600;
            justify-content: center;
        }

        .site-mark {
            background-color: #d32f2f;
            color: white;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 800;
        }

        /* 반응형 */
        @media (max-width: 1100px) {
            .hero-device-img { width: 500px; right: 0; }
            .features { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>
<body>

    <header>
        <div class="header-left">
            <a href="#" class="logo">
                <span class="logo-mark">ISA</span>
                일신오토클레이브
            </a>
            <div class="search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <span>Search</span>
                <div class="search-key">Ctrl K</div>
            </div>
        </div>
        <nav>
            <ul>
                <li><a href="#" class="active">홈</a></li>
                <li><a href="#">매뉴얼</a></li>
                <li><a href="#">기술 문서</a></li>
                <li><a href="#">예제</a></li>
                <li><a href="#">교육 영상</a></li>
                <li><a href="#">다운로드 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i></a></li>
                <li><a href="#">회사 <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i></a></li>
            </ul>
        </nav>
        <div class="header-right">
            <i class="fa-solid fa-language"></i>
            <i class="fa-solid fa-moon"></i>
            <i class="fa-brands fa-github"></i>
        </div>
    </header>

    <main class="container">
        <section class="hero">
            <div class="hero-title-brand">Ilshin Autoclave</div>
            <h1>ISOSTATIC PRESS 기술자료</h1>
            <p>초고압 기술과 정밀한 제어 시스템을 바탕으로 구축된 등방압 가압장치 솔루션입니다. 일신만의 독보적인 기술력으로 최상의 공정 환경을 제공합니다.</p>
            
            <div class="hero-buttons">
                <a href="#" class="btn btn-primary">매뉴얼</a>
                <a href="#" class="btn btn-secondary">다운로드</a>
                <a href="#" class="btn btn-secondary">소개 영상 <i class="fa-regular fa-clone"></i></a>
            </div>

            <img src="/mainimg.png" alt="ISOSTATIC PRESS" class="hero-device-img">
        </section>

        <section class="features">
            <div class="feature-card">
                <div class="icon-wrap"><i class="fa-solid fa-industry"></i></div>
                <h3>맞춤형 장비 라인업</h3>
                <p>실험실용 소형 장비부터 산업용 대형 양산 라인까지, 고객의 공정에 최적화된 맞춤 솔루션을 제안합니다.</p>
            </div>
            <div class="feature-card">
                <div class="icon-wrap"><i class="fa-solid fa-gauge-high"></i></div>
                <h3>초고압 정밀 제어</h3>
                <p>일신오토클레이브만의 고유 기술로 압력과 온도를 실시간 정밀 제어하여 결과물의 균일성을 보장합니다.</p>
            </div>
            <div class="feature-card">
                <div class="icon-wrap"><i class="fa-solid fa-shield-halved"></i></div>
                <h3>글로벌 안전 인증</h3>
                <p>ASME, CE, KCS 등 국내외 압력용기 주요 인증을 획득하여 가장 안전한 작업 환경을 제공합니다.</p>
            </div>
            <div class="feature-card">
                <div class="icon-wrap"><i class="fa-solid fa-laptop-code"></i></div>
                <h3>전용 운영 소프트웨어</h3>
                <p>자체 개발한 직관적인 UI의 운영 시스템을 통해 복잡한 가압 공정을 쉽고 체계적으로 관리할 수 있습니다.</p>
            </div>
        </section>
    </main>

    <footer class="family-sites">
        <h2>FAMILY SITES</h2>
        <div class="site-grid">
            <a href="#" class="site-item">
                <span class="site-mark">ISA</span> 일신오토클레이브
            </a>
            <a href="#" class="site-item">
                <i class="fa-brands fa-youtube" style="color: #ff0000; font-size: 1.4rem;"></i> 일신 공식 유튜브
            </a>
            <a href="#" class="site-item">
                <span class="site-mark">PS</span> 일신 공식 블로그
            </a>
            <a href="#" class="site-item">
                <span class="site-mark">SU</span> 펌스터
            </a>
            <a href="#" class="site-item">
                <span class="site-mark">TS</span> 하이플럭스
            </a>
        </div>
    </footer>

</body>
</html>
