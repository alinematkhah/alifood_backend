<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>اپلیکیشن فست‌فود رئیس</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet">
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        :root{
            --bg:#fff9ef;
            --brand:#ff3b30;
            --accent:#ffbf00;
            --ink:#2b2b2b;
            --muted:#6b6b6b;
            --card:#ffffff;
            --shadow: 0 8px 24px rgba(0,0,0,.12);
            --radius:20px;
        }
        *{
            box-sizing:border-box;
            font-family: 'Vazirmatn', sans-serif !important;
        }
        html,body{height:100%}
        body{
            margin:0;
            color:var(--ink);
            background:var(--bg);
        }
        .app{max-width:480px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;position:relative;}
        .content{flex:1; padding:16px 16px 96px; position:relative;}
        .wallpaper{
            position:absolute; inset:0; z-index:0; opacity:.075; pointer-events:none;
            background-image:
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><text x="10" y="38" font-size="32">🍔</text></svg>'),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140"><text x="10" y="44" font-size="36">🍕</text></svg>'),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><text x="10" y="38" font-size="32">🍟</text></svg>'),
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130"><text x="10" y="44" font-size="36">🥤</text></svg>');
            background-size: 120px 120px, 140px 140px, 120px 120px, 130px 130px;
            background-repeat: repeat;
            background-position: 0 0, 60px 60px, 30px 90px, 90px 30px;
            filter: saturate(0.8);
        }
        header{
            position:relative;
            top:0;
            z-index:10;
            padding:12px 16px;
            display:flex;
            justify-content:center;
            border-bottom:none;
        }
        .header-card {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:16px;
            padding:14px 16px;
            border-radius:var(--radius);
            background:var(--card);
            box-shadow:var(--shadow);
            width:100%;
        }
        .header-text {
            display:flex;
            flex-direction:column;
            flex:1;
        }
        .brand{font-weight:900;letter-spacing:.2px; font-size:18px;}
        .tagline{font-size:13px; color:var(--muted); margin-top:4px;}
        .logo{width:38px;height:38px;background:var(--brand);border-radius:12px;display:grid;place-items:center;color:#fff;font-weight:800;box-shadow:var(--shadow)}
        .card{background:var(--card); border-radius:var(--radius); box-shadow:var(--shadow); position:relative}
        .card.pad{padding:16px}
        .chips{display:flex; gap:8px; flex-wrap:wrap; justify-content: flex-end;}
        .chip{padding:8px 12px; border-radius:999px; background:#fff; border:1px solid rgba(0,0,0,.06); cursor:pointer; font-weight:600;}
        .chip.active{background:var(--ink); color:#fff}
        .bottom-nav {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 8px;
            width: min(480px, 100% - 16px);
            z-index: 20;
        }
        .nav-wrap {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
            background: rgba(255, 255, 255, .9);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 4px;
            box-shadow: var(--shadow);
            border: 1px solid rgba(0, 0, 0, .06);
        }
        .tab {
            appearance: none;
            border: none;
            background: transparent;
            padding: 6px;
            border-radius: 12px;
            font-weight: 800;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            cursor: pointer;
            font-size: 12px;
        }
        .tab .i {
            font-size: 16px;
        }
        .tab.active {
            background: var(--brand);
            color: #fff;
        }
        h2{font-size:20px; font-weight:900; margin-top:0; margin-bottom:12px;}
        .section-title{font-weight:900;}
        section{display:none; position:relative; z-index:1}
        section.active{display:block; animation:fade .3s ease}
        @keyframes fade{from{opacity:.4; transform:translateY(6px)}to{opacity:1; transform:none}}
        #game-intro {
            text-align: right;
        }
        #game-intro h2 {
            font-size: 20px;
            font-weight: 900;
            margin-top: 0;
        }
        #game-intro ul {
            list-style: none;
            padding-right: 20px;
            margin: 0;
            font-size: 14px;
            color: var(--muted);
        }
        #game-intro strong {
            color: var(--ink);
        }
        #game-intro li {
            margin-bottom: 8px;
        }
        #game-intro .btn {
            width: 100%;
            margin-top: 16px;
        }
        .game-info-bar{
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #f0f0f0;
            border-radius: 12px;
            padding: 10px 16px;
            margin-bottom: 16px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
        .game-info-bar .score{font-weight: 800; font-size: 15px;}
        .game-info-bar .score span{font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 18px;}
        .btn{background:var(--brand); color:#fff; border:none; padding:10px 14px; border-radius:12px; font-weight:800; cursor:pointer; box-shadow:var(--shadow);}
        .btn.secondary{background:var(--ink)}
        .puzzle-grid{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            aspect-ratio: 1/1;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--shadow);
            background: #e0e0e0;
        }
        .puzzle-tile {
            position: relative;
            background-size: 300% 300%;
            background-repeat: no-repeat;
            cursor: pointer;
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
            border: 2px solid transparent;
        }
        .puzzle-tile.selected {
            border-color: #007bff;
            transform: scale(1.05);
            box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
        }
        .win{margin-top:12px; padding:12px; border-radius:14px; background:#e7ffe7; font-weight:700; border:1px solid #b6f0b6; text-align: right;}
        #image-preview {
            width: 100%;
            aspect-ratio: 1/1;
            display: none;
            border-radius: 16px;
            object-fit: cover;
            box-shadow: var(--shadow);
        }
        .toolbar{display:flex; align-items:center; justify-content:space-between; margin-bottom:12px}
        .coupon{display:flex; gap:12px; padding:14px; border-radius:18px; border:1px dashed rgba(0,0,0,.15); background:#fff; align-items:center}
        .coupon.badge:before{content:"باز شده"; position:absolute; top:-10px; left:16px; right:unset; background:var(--accent); padding:6px 10px; border-radius:999px; font-weight:800; font-size:12px}
        .coupon .pic{font-size:28px}
        .coupon .meta{flex:1}
        .coupon .title{font-weight:900;}
        .coupon .desc{font-size:13px; color:var(--muted)}
        .coupon .code{font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; background:#fff7e6; padding:6px 8px; border-radius:8px; border:1px solid rgba(0,0,0,.08); direction: ltr; text-align: left;}
        .coupon-expiry {
            font-size: 12px;
            color: var(--muted);
            margin-top: 4px;
            font-weight: 600;
        }
        .about-grid{display:grid; gap:12px}
        .about-card{display:flex; gap:12px; align-items:center}
        .about-icon{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#fff1f1; font-size:22px}
        .hours{display:grid; grid-template-columns:1fr auto; gap:6px; font-size:14px; color:var(--muted)}
        .about-card .title{font-weight:800;}
        .garnish{
            position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0;
        }
        .chip-emoji{position:absolute; font-size:42px; opacity:.14; animation:float 12s ease-in-out infinite}
        .chip-emoji:nth-child(1){right:6%; top:8%; left:unset;}
        .chip-emoji:nth-child(2){left:10%; top:24%; right:unset; animation-duration:11s}
        .chip-emoji:nth-child(3){right:14%; bottom:18%; left:unset; animation-duration:13s}
        .chip-emoji:nth-child(4){left:16%; bottom:8%; right:unset; animation-duration:15s}
        @keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-8px)}100%{transform:translateY(0)}}
        .msg-box{
            position:fixed;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            width:min(320px, 90%);
            padding:20px;
            background:#fff;
            border-radius:16px;
            box-shadow:var(--shadow);
            z-index:100;
            display:none;
        }
        .msg-box-text{font-size:16px; margin-bottom:16px; text-align:center;}
        .msg-box-btn{width:100%;}
        .overlay{
            position:fixed;
            top:0; left:0; right:0; bottom:0;
            background:rgba(0,0,0,.5);
            backdrop-filter:blur(2px);
            z-index:99;
            display:none;
        }
        .confirm-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(320px, 90%);
            padding: 20px;
            background: #fff;
            border-radius: 16px;
            box-shadow: var(--shadow);
            z-index: 100;
            display: none;
        }
        .confirm-box-text {
            font-size: 16px;
            margin-bottom: 16px;
            text-align: center;
        }
        .confirm-box-actions {
            display: flex;
            gap: 8px;
        }
        .confirm-box-actions .btn {
            flex: 1;
        }
        .mt8{margin-top:8px} .mt12{margin-top:12px} .mt16{margin-top:16px}
        .mb8{margin-bottom:8px} .mb12{margin-bottom:12px}
        .text-right{text-align:right;}
        .flex{display:flex; gap:12px; align-items:center;}
        @supports(padding:max(0px)){
            .content{padding-bottom: calc(96px + env(safe-area-inset-bottom));}
            .bottom-nav{bottom: calc(12px + env(safe-area-inset-bottom));}
        }
        .about-card.instagram .about-link {
            margin-right: auto;
            margin-left: unset;
            text-decoration: none;
            padding: 8px 12px;
        }
    </style>
</head>
<body>
    <div class="app">
        <div class="wallpaper"></div>
        <header>
            <div class="header-card">
                <div class="header-text">
                    <div class="brand">فست فود رئیس</div>
                    <div class="tagline">بازی کن • تخفیف بگیر • لذت ببر</div>
                </div>
                <img src="images/logo/logo.jpg" alt="لوگوی شرکت شما" style="height: 60px;">
            </div>
        </header>
        <main class="content">
            <div class="garnish" aria-hidden="true">
                <div class="chip-emoji">🍔</div>
                <div class="chip-emoji">🍕</div>
                <div class="chip-emoji">🍗</div>
                <div class="chip-emoji">🥤</div>
            </div>
            <section id="tab-game" class="active">
                <div class="card pad">
                    <div class="game-info-bar">
                        <div class="score">حرکات: <span id="moves">0</span></div>
                        <div class="score">زمان: <span id="timer">0</span> ثانیه</div>
                    </div>
                    <div id="game-intro" style="display: block;">
                        <h2>قوانین بازی</h2>
                        <p style="font-size:14px; color:var(--muted);">وقتی بازی رو شروع می‌کنی، فقط کافیه پازل رو مرتب کنی! شرایط دریافت جایزه اینجاست:</p>
                        <ul>
                            <li><strong>اگه تو کمتر از ۱۰ ثانیه پازل رو حل کنی، ۲۰٪ تخفیف می‌گیری!</strong></li>
                            <li><strong>اگه تو کمتر از ۱۵ ثانیه تمومش کنی، ۱۰٪ تخفیف نصیبت میشه.</strong></li>
                            <li><strong>اگه تو کمتر از ۲۰ ثانیه حلش کنی، ۵٪ تخفیف داری.</strong></li>
                            <li>ولی اگه بیشتر از ۲۰ ثانیه طول بکشه، متأسفانه تخفیفی نیست!</li>
                        </ul>
                        <p style="font-size:12px; color:var(--muted); margin-top: 16px;">
                            <strong>نکته ۱:</strong> حواست باشه، تو هر سفارش فقط می‌تونی از ۱ کد تخفیف استفاده کنی.
                            <br>
                            <strong>نکته ۲:</strong> هر کد تخفیف فقط ۱ هفته اعتبار داره، پس عجله کن و ازش استفاده کن!
                        </p>
                        <button class="btn" id="btnStartGame">شروع بازی</button>
                    </div>
                    <div id="game-play" style="display: none;">
                        <img id="image-preview" src="" alt="Full puzzle image">
                        <div class="puzzle-grid" id="puzzle-grid"></div>
                        <button class="btn mt12" id="btnRestart">شروع مجدد</button>
                    </div>
                </div>
                <div class="mt12" style="font-size:13px;color:var(--muted)">بازی پازل: تصویر به هم ریخته را در کمترین زمان مرتب کن تا جایزه بگیری.</div>
            </section>
            <section id="tab-deals">
                <div class="card pad">
                    <div class="toolbar">
                        <div class="section-title">کدهای تخفیف</div>
                        <div class="chips" id="filterChips">
                            <button class="chip active" data-type="all">همه</button>
                            <button class="chip" data-type="20">۲۰٪</button>
                            <button class="chip" data-type="10">۱۰٪</button>
                            <button class="chip" data-type="5">۵٪</button>
                            <button class="chip" data-type="special">تخفیف خاص</button>
                        </div>
                    </div>
                    <div id="coupons" class="stack" style="display:grid; gap:12px">
                        <div id="noCouponsMsg" style="text-align: center; color: var(--muted); padding: 20px;">
                            هنوز کد تخفیفی نداری! برو بازی کن و جایزه بگیر. 🏆
                        </div>
                    </div>
                </div>
            </section>
            <section id="tab-about">
                <div class="card pad">
                    <div class="flex mb8">
                        <div style="font-size:28px">🍔</div>
                        <div>
                            <div class="section-title" style="font-size:20px">درباره فست‌فود رئیس</div>
                            <div style="font-size:13px; color:var(--muted)">برند رئیس با بیش از ۱۰ سال سابقه در زمینه هلدینگ غذایی با کادری مجرب و کاربلد، تضمین لحظاتی فوق العاده را به شما در کنار خانواده و دوستانتان می دهد.</div>
                        </div>
                    </div>
                </div>
                <div class="about-card card pad mt16">
                    <div class="about-icon">📍</div>
                    <div>
                        <div class="title" style="font-weight:800">آدرس‌ها</div>
                        <div class="desc" style="font-size:14px; color:var(--muted); margin-top: 8px;">
                            <ul style="list-style:none; padding:0; margin:0;">
                                <li style="margin-bottom: 4px;">هفت تیر: بین هفت تیر ۱۳ و ۱۵</li>
                                <li style="margin-bottom: 4px;">وکیل آباد: نبش وکیل آباد ۱۳</li>
                                <li style="margin-bottom: 4px;">پارک بازار: پارک بازار، نبش مفتح ۳۳</li>
                                <li>احمدآباد: بین رضا و ملاصدرا، طبقه۲بازارقسطنطنیه</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="about-card card pad instagram mt16">
                    <div class="about-icon" style="background:#fff0f5">📸</div>
                    <div style="flex: 1;">
                        <div class="title" style="font-weight:800">اینستاگرام</div>
                    </div>
                    <a class="about-link btn" href="https://www.instagram.com/raees.food_/" target="_blank">مشاهده</a>
                </div>
                <div class="about-card card pad mt16">
                    <div class="about-icon" style="background:#eef7ff">☎️</div>
                    <div>
                        <div class="title" style="font-weight:800">تماس</div>
                        <div class="desc" style="font-size:14px; color:var(--muted); margin-top: 8px;">
                            <ul style="list-style:none; padding:0; margin:0;">
                                <li style="margin-bottom: 4px;">هفت تیر: ۰۵۱۳۸۹۱۴۰۴۰</li>
                                <li style="margin-bottom: 4px;">وکیل آباد: ۰۵۱۳۶۰۳۳۶۳۶</li>
                                <li style="margin-bottom: 4px;">پارک بازار: ۰۵۱۳۲۵۰۴۳۷۴</li>
                                <li>احمدآباد: ۰۵۱۳۸۴۷۴۰۴۰</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="about-card card pad mt16">
                    <div class="about-icon" style="background:#eefbea">🕒</div>
                    <div style="width:100%">
                        <div class="title" style="font-weight:800">ساعت کاری</div>
                        <div class="desc" style="font-size:14px; color:var(--muted); margin-top: 8px;">
                            همه روزه از ساعت ۱۲ ظهر الی ۲ بامداد
                        </div>
                    </div>
                </div>
                <div class="mt12" style="font-size:13px;color:var(--muted)">برای تخفیف‌های ویژه و پشت صحنه آشپزخانه ما را دنبال کنید.</div>
            </section>
        </main>
        <nav class="bottom-nav" role="tablist" aria-label="Primary">
            <div class="nav-wrap">
                <button class="tab active" data-target="tab-game" aria-selected="true" role="tab">
                    <div class="i">🎮</div>
                    <div>بازی</div>
                </button>
                <button class="tab" data-target="tab-deals" aria-selected="false" role="tab">
                    <div class="i">💸</div>
                    <div>تخفیف‌ها</div>
                </button>
                <button class="tab" data-target="tab-about" aria-selected="false" role="tab">
                    <div class="i">🍔</div>
                    <div>درباره ما</div>
                </button>
            </div>
        </nav>
        <div id="msgBox" class="msg-box">
            <div id="msgText" class="msg-box-text"></div>
            <button class="btn msg-box-btn" onclick="hideMsg()">باشه</button>
        </div>
        <div id="overlay" class="overlay"></div>
        <div id="confirmBox" class="confirm-box">
            <div id="confirmText" class="confirm-box-text">آیا مطمئن هستید که می‌خواهید بازی را ترک کنید؟</div>
            <div class="confirm-box-actions">
                <button class="btn secondary" id="btnConfirmCancel">خیر</button>
                <button class="btn" id="btnConfirmOk">بله</button>
            </div>
        </div>
    </div>
    <script>
        const API_URL = 'https://alifood-backend.onrender.com/api';
        const msgBox = document.getElementById('msgBox');
        const msgText = document.getElementById('msgText');
        const overlay = document.getElementById('overlay');
        function showMsg(message) {
            msgText.textContent = message;
            msgBox.style.display = 'block';
            overlay.style.display = 'block';
        }
        function hideMsg() {
            msgBox.style.display = 'none';
            overlay.style.display = 'none';
        }
        const confirmBox = document.getElementById('confirmBox');
        const btnConfirmOk = document.getElementById('btnConfirmOk');
        const btnConfirmCancel = document.getElementById('btnConfirmCancel');
        let onConfirmCallback = null;
        function showConfirm(message, onOk, onCancel) {
            document.getElementById('confirmText').textContent = message;
            confirmBox.style.display = 'block';
            overlay.style.display = 'block';
            btnConfirmOk.onclick = () => {
                confirmBox.style.display = 'none';
                overlay.style.display = 'none';
                if (onOk) onOk();
            };
            btnConfirmCancel.onclick = () => {
                confirmBox.style.display = 'none';
                overlay.style.display = 'none';
                if (onCancel) onCancel();
            };
        }
        const tabs = document.querySelectorAll('.tab');
        const sections = document.querySelectorAll('main section');
        let isGameInProgress = false;
        tabs.forEach(btn => btn.addEventListener('click', (e) => {
            const currentActiveTab = document.querySelector('.tab.active');
            const targetSectionId = btn.getAttribute('data-target');
            if (currentActiveTab.getAttribute('data-target') === 'tab-game' && isGameInProgress) {
                e.preventDefault();
                showConfirm('آیا مطمئن هستید که می‌خواهید بازی را ترک کنید؟ پیشرفت شما از بین خواهد رفت.', () => {
                    resetGameToIntro();
                    switchTab(btn, targetSectionId);
                }, () => {});
            } else {
                switchTab(btn, targetSectionId);
            }
        }));
        function switchTab(btn, targetSectionId) {
            tabs.forEach(b => { 
                b.classList.remove('active'); 
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active'); 
            btn.setAttribute('aria-selected', 'true');
            sections.forEach(s => s.classList.toggle('active', s.id === targetSectionId));
            if (targetSectionId === 'tab-game') {
                resetGameToIntro();
            } else if (targetSectionId === 'tab-deals') {
                renderCoupons();
            }
        }
        let PUZZLE_IMAGES = [];
        let currentPuzzleIndex = 0; // برای مدیریت ترتیب Round-Robin
        const PREVIEW_DURATION = 5000;
        const PUZZLE_SIZE = 3;
        const puzzleGridEl = document.getElementById('puzzle-grid');
        const imagePreviewEl = document.getElementById('image-preview');
        const timerEl = document.getElementById('timer');
        const movesEl = document.getElementById('moves');
        const btnStartGame = document.getElementById('btnStartGame');
        const btnRestart = document.getElementById('btnRestart');
        const gameIntro = document.getElementById('game-intro');
        const gamePlay = document.getElementById('game-play');
        let currentPuzzleImage = '';
        let pieces = []; 
        let moves = 0;
        let selectedPieces = []; 
        let lockBoard = false; 
        let timer; 
        let time = 0; 
        let gameStarted = false; 
        let previewTimeoutId; 
        async function loadPuzzleImages() {
            try {
                const response = await fetch(`${API_URL}/get-puzzle-images`);
                if (!response.ok) throw new Error('Failed to load puzzle images');
                PUZZLE_IMAGES = await response.json();
                if (PUZZLE_IMAGES.length === 0) {
                    showMsg('هیچ تصویری برای پازل یافت نشد!');
                }
            } catch (error) {
                console.error('Error loading puzzle images:', error);
                showMsg('خطا در بارگذاری تصاویر پازل! لطفاً دوباره تلاش کنید.');
            }
        }
        function initializeGame() {
            clearTimeout(previewTimeoutId); 
            clearInterval(timer);
            moves = 0;
            movesEl.textContent = moves;
            selectedPieces = [];
            lockBoard = false;
            gameStarted = false; 
            time = 0; 
            timerEl.textContent = '0';
            if (pieces.length > 0) {
                pieces.forEach(piece => piece.removeEventListener('click', selectPiece));
            }
            puzzleGridEl.innerHTML = '';
            imagePreviewEl.style.display = 'none';
            if (PUZZLE_IMAGES.length === 0) {
                showMsg('هیچ تصویری برای پازل یافت نشد!');
                return;
            }
            // انتخاب تصویر بعدی به‌صورت Round-Robin
            let previousPuzzleImage = currentPuzzleImage;
            currentPuzzleIndex = (currentPuzzleIndex + 1) % PUZZLE_IMAGES.length;
            currentPuzzleImage = PUZZLE_IMAGES[currentPuzzleIndex];
            // اطمینان از متفاوت بودن تصویر با تصویر قبلی
            while (currentPuzzleImage === previousPuzzleImage && PUZZLE_IMAGES.length > 1) {
                currentPuzzleIndex = (currentPuzzleIndex + 1) % PUZZLE_IMAGES.length;
                currentPuzzleImage = PUZZLE_IMAGES[currentPuzzleIndex];
            }
            imagePreviewEl.src = currentPuzzleImage;
            imagePreviewEl.style.display = 'block';
            previewTimeoutId = setTimeout(() => {
                imagePreviewEl.style.display = 'none';
                createPuzzlePieces(); 
                shufflePieces();
                puzzleGridEl.style.display = 'grid';
                isGameInProgress = true;
            }, PREVIEW_DURATION);
        }
        function resetGameToIntro() {
            stopTimer();
            isGameInProgress = false;
            gameIntro.style.display = 'block';
            gamePlay.style.display = 'none';
        }
        function startTimer() {
            if (!gameStarted) {
                gameStarted = true;
                timer = setInterval(() => {
                    time++;
                    timerEl.textContent = time;
                }, 1000);
            }
        }
        function createPuzzlePieces() {
            pieces = [];
            puzzleGridEl.innerHTML = '';
            for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
                const piece = document.createElement('div');
                piece.classList.add('puzzle-tile');
                const row = Math.floor(i / PUZZLE_SIZE);
                const col = i % PUZZLE_SIZE;
                const xPos = ((PUZZLE_SIZE - 1 - col) / (PUZZLE_SIZE - 1)) * 100;
                const yPos = (row / (PUZZLE_SIZE - 1)) * 100;
                piece.style.backgroundImage = `url('${currentPuzzleImage}')`;
                piece.style.backgroundPosition = `${xPos}% ${yPos}%`;
                piece.dataset.correctIndex = i; 
                piece.dataset.currentPosition = i; 
                piece.addEventListener('click', selectPiece);
                pieces.push(piece);
            }
        }
        function shufflePieces() {
            let shuffledPieces = [...pieces]; 
            let attempts = 0;
            const maxAttempts = 100;
            do {
                for (let i = shuffledPieces.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledPieces[i], shuffledPieces[j]] = [shuffledPieces[j], shuffledPieces[i]];
                }
                attempts++;
                if (attempts > maxAttempts) { 
                    break;
                }
            } while (isSolved(shuffledPieces)); 
            puzzleGridEl.innerHTML = ''; 
            shuffledPieces.forEach((piece, index) => {
                piece.dataset.currentPosition = index; 
                puzzleGridEl.appendChild(piece);
            });
        }
        function isSolved(piecesArray) {
            for (let i = 0; i < piecesArray.length; i++) {
                if (parseInt(piecesArray[i].dataset.correctIndex) !== i) {
                    return false;
                }
            }
            return true;
        }
        function selectPiece() {
            if (lockBoard) return;
            startTimer(); 
            const clickedPiece = this;
            if (selectedPieces.includes(clickedPiece)) {
                clickedPiece.classList.remove('selected');
                selectedPieces = selectedPieces.filter(p => p !== clickedPiece);
                return;
            }
            if (selectedPieces.length === 0) {
                selectedPieces.push(clickedPiece);
                clickedPiece.classList.add('selected');
            } else if (selectedPieces.length === 1) {
                selectedPieces.push(clickedPiece);
                clickedPiece.classList.add('selected');
                lockBoard = true;
                const [piece1, piece2] = selectedPieces;
                const parent = piece1.parentNode;
                const placeholder1 = document.createElement('div');
                const placeholder2 = document.createElement('div');
                parent.replaceChild(placeholder1, piece1);
                parent.replaceChild(placeholder2, piece2);
                parent.replaceChild(piece2, placeholder1);
                parent.replaceChild(piece1, placeholder2);
                const pos1 = parseInt(piece1.dataset.currentPosition);
                const pos2 = parseInt(piece2.dataset.currentPosition);
                piece1.dataset.currentPosition = pos2;
                piece2.dataset.currentPosition = pos1;
                piece1.classList.remove('selected');
                piece2.classList.remove('selected');
                moves++;
                movesEl.textContent = moves;
                selectedPieces = [];
                lockBoard = false;
                checkWin();
            }
        }
        function checkWin() {
            const currentPiecesInDOM = Array.from(puzzleGridEl.children);
            let isPuzzleSolved = true;
            for (let i = 0; i < currentPiecesInDOM.length; i++) {
                if (parseInt(currentPiecesInDOM[i].dataset.correctIndex) !== i) {
                    isPuzzleSolved = false;
                    break;
                }
            }
            if (isPuzzleSolved) {
                puzzleGridEl.style.display = 'none';
                imagePreviewEl.src = currentPuzzleImage;
                imagePreviewEl.style.display = 'block';
                onWin();
            }
        }
        async function onWin() {
            stopTimer();
            gameStarted = false;
            isGameInProgress = false;
            pieces.forEach(piece => piece.removeEventListener('click', selectPiece));
            const discountInfo = determineDeal();
            let message = `شما پازل را در ${time} ثانیه و ${moves} حرکت حل کردید!`;
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            const couponData = {
                userId: user.id,
                username: user.username || user.first_name || 'Unknown',
                puzzleImage: currentPuzzleImage,
                time: time,
                moves: moves,
                createdAt: new Date().toISOString()
            };
            if (discountInfo) {
                try {
                    const response = await fetch(`${API_URL}/generate-unique-code`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ percent: discountInfo.percent })
                    });
                    if (!response.ok) throw new Error('Failed to generate unique code');
                    const { code } = await response.json();
                    couponData.id = code;
                    couponData.title = discountInfo.title;
                    couponData.desc = discountInfo.desc;
                    couponData.percent = discountInfo.percent;
                    couponData.type = discountInfo.type;
                    couponData.emoji = '🏆';
                    couponData.expiry = new Date().setDate(new Date().getDate() + 7);
                    couponData.status = 'فعال';
                    couponData.expiryDays = 7;
                    await saveCoupon(couponData);
                    message += `\n\nشما برنده یک کد تخفیف ${discountInfo.percent}% شدید! کد تخفیف شما: ${code}`;
                } catch (error) {
                    message += `\n\nخطا در ذخیره کد تخفیف! لطفاً دوباره تلاش کنید.`;
                }
            } else {
                couponData.status = 'بدون تخفیف';
                await saveCoupon(couponData);
                message += `\n\nمتاسفانه تخفیفی به شما تعلق نگرفت. دوباره تلاش کنید!`;
            }
            showMsg(message);
        }
        function determineDeal() {
            if (time <= 10) return { percent: 20, title: '۲۰٪ تخفیف عمومی', desc: 'تخفیف ویژه برای برندگان.', type: '20' };
            if (time <= 15) return { percent: 10, title: '۱۰٪ تخفیف عمومی', desc: 'تخفیف عمومی برای برندگان.', type: '10' };
            if (time <= 20) return { percent: 5, title: '۵٪ تخفیف عمومی', desc: 'تخفیف عمومی برای برندگان.', type: '5' };
            return null;
        }
        btnStartGame.addEventListener('click', () => {
            gameIntro.style.display = 'none';
            gamePlay.style.display = 'block';
            initializeGame();
        });
        btnRestart.addEventListener('click', () => {
            stopTimer();
            initializeGame();
        });
        function stopTimer() {
            clearInterval(timer);
            timer = null;
        }
        let allCoupons = [];
        const EXPIRY_DAYS = 7;
        const couponsWrap = document.getElementById('coupons');
        const noCouponsMsg = document.getElementById('noCouponsMsg');
        const chips = document.querySelectorAll('#filterChips .chip');
        async function saveCoupon(coupon) {
            try {
                const response = await fetch(`${API_URL}/save-coupon`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(coupon)
                });
                if (!response.ok) throw new Error('Failed to save coupon');
                allCoupons.push(coupon);
                renderCoupons(document.querySelector('#filterChips .chip.active').dataset.type);
            } catch (error) {
                console.error('Error saving coupon:', error);
                throw error;
            }
        }
        async function loadCoupons() {
            try {
                const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
                const response = await fetch(`${API_URL}/get-coupons?userId=${userId}`);
                if (!response.ok) throw new Error('Failed to load coupons');
                allCoupons = await response.json();
                renderCoupons();
            } catch (error) {
                console.error('Error loading coupons:', error);
                showMsg('خطا در بارگذاری کدهای تخفیف! لطفاً دوباره تلاش کنید.');
            }
        }
        chips.forEach(ch => ch.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active')); ch.classList.add('active');
            renderCoupons(ch.dataset.type);
        }));
        async function addSpecialCoupon(id, title, desc, type, percent, emoji) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            const coupon = {
                userId: user.id,
                id,
                title,
                type,
                percent,
                emoji,
                desc,
                expiry: expiryDate.getTime(),
                username: user.username || user.first_name || 'Unknown',
                puzzleImage: currentPuzzleImage,
                time,
                moves,
                status: 'فعال',
                createdAt: new Date().toISOString()
            };
            await saveCoupon(coupon);
        }
        function renderCoupons(filter = 'all') {
            const now = Date.now();
            couponsWrap.innerHTML = '';
            const filteredList = allCoupons.filter(c => {
                if (filter === 'all') return true;
                if (filter === 'special') return c.type === 'special';
                const filterPercent = parseInt(filter);
                return c.percent === filterPercent;
            });
            if (filteredList.length === 0) {
                noCouponsMsg.style.display = 'block';
                couponsWrap.appendChild(noCouponsMsg);
            } else {
                noCouponsMsg.style.display = 'none';
                filteredList.forEach(c => {
                    const daysRemaining = Math.ceil((c.expiry - now) / (1000 * 60 * 60 * 24));
                    const el = document.createElement('div');
                    el.className = 'coupon card';
                    el.innerHTML = `
                        <div class="pic">${c.emoji}</div>
                        <div class="meta">
                            <div class="title">${c.title}</div>
                            <div class="desc">${c.desc}</div>
                            <div class="mt8 code">${c.id}</div>
                            <div class="coupon-expiry">
                                <span style="font-weight:700">${daysRemaining} روز</span> تا انقضا باقی مانده است.
                            </div>
                        </div>
                        <button class="btn" data-copy="${c.id}">کپی</button>`;
                    couponsWrap.appendChild(el);
                });
            }
            couponsWrap.querySelectorAll('[data-copy]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const code = btn.getAttribute('data-copy');
                    const tempInput = document.createElement('input');
                    tempInput.value = code;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    btn.textContent = 'کپی شد!';
                    setTimeout(() => btn.textContent = 'کپی', 1000);
                });
            });
        }
        window.Telegram.WebApp.ready();
        loadCoupons();
        loadPuzzleImages();
    </script>
</body>
</html>
