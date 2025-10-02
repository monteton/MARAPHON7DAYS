document.addEventListener('DOMContentLoaded', () => {

    // --- Элементы страницы ---
    const landingPage = document.getElementById('landing-page');
    const mainPage = document.getElementById('main-page');
    const bottomNav = document.getElementById('bottom-nav');
    const contentPages = document.querySelectorAll('.page-content');

    // --- Кнопки ---
    const startButton = document.getElementById('start-button');
    const homeButton = document.getElementById('home-button');
    const mainPageButtons = document.querySelectorAll('[data-target]');
    const closePageButtons = document.querySelectorAll('.close-page-button');

    // --- Элементы для просмотра PDF ---
    const pdfViewerModal = document.getElementById('pdf-viewer-modal');
    const pdfCloseButton = document.getElementById('pdf-close-button');
    const pdfCanvas = document.getElementById('pdf-canvas');
    const pdfCanvasContainer = document.getElementById('pdf-canvas-container');
    const prevPageButton = document.getElementById('pdf-prev-page');
    const nextPageButton = document.getElementById('pdf-next-page');
    const pageNumSpan = document.getElementById('pdf-page-num');
    const pageCountSpan = document.getElementById('pdf-page-count');

    // --- Состояние PDF ---
    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;

    // --- Логика приложения ---

    // 1. Начальное состояние: скрыть навигацию на главной странице
    bottomNav.classList.add('hidden');

    // Функция для отображения главного меню
    const showMainMenu = () => {
        landingPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        bottomNav.classList.remove('hidden');
        contentPages.forEach(page => {
            page.classList.add('hidden');
            page.querySelectorAll('video').forEach(video => {
                video.pause();
                video.currentTime = 0;
            });
        });
    };

    // 2. Кнопка "Старт" и кнопка "Домой"
    startButton.addEventListener('click', showMainMenu);
    homeButton.addEventListener('click', showMainMenu);

    // 3. Открытие страницы с контентом из главного меню
    mainPageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                mainPage.classList.add('hidden');
                targetPage.classList.remove('hidden');
                targetPage.scrollTop = 0;
            }
        });
    });

    // 4. Закрытие страницы с контентом
    closePageButtons.forEach(button => {
        button.addEventListener('click', () => {
            showMainMenu();
        });
    });

    // --- Логика для просмотра PDF ---

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    const renderPage = num => {
        pageRendering = true;
        pdfDoc.getPage(num).then(page => {
            const unscaledViewport = page.getViewport({ scale: 1 });
            const containerWidth = pdfCanvasContainer.clientWidth > 0 ? pdfCanvasContainer.clientWidth : window.innerWidth * 0.9;
            const scale = (containerWidth - 40) / unscaledViewport.width;
            const viewport = page.getViewport({ scale: scale });
            const context = pdfCanvas.getContext('2d');
            const outputScale = window.devicePixelRatio || 1;

            pdfCanvas.width = Math.floor(viewport.width * outputScale);
            pdfCanvas.height = Math.floor(viewport.height * outputScale);
            pdfCanvas.style.width = Math.floor(viewport.width) + 'px';
            pdfCanvas.style.height = Math.floor(viewport.height) + 'px';
            
            context.scale(outputScale, outputScale);

            const renderContext = { canvasContext: context, viewport: viewport };
            page.render(renderContext).promise.then(() => {
                pageRendering = false;
                if (pageNumPending !== null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
        pageNumSpan.textContent = num;
    };

    const queueRenderPage = num => {
        if (pageRendering) pageNumPending = num; else renderPage(num);
    };

    prevPageButton.addEventListener('click', () => { if (pageNum <= 1) return; pageNum--; queueRenderPage(pageNum); });
    nextPageButton.addEventListener('click', () => { if (pageNum >= pdfDoc.numPages) return; pageNum++; queueRenderPage(pageNum); });

    const openPdfViewer = (url) => {
        pdfViewerModal.classList.remove('hidden');
        pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            pageCountSpan.textContent = pdfDoc.numPages;
            pageNum = 1;
            renderPage(pageNum);
        }).catch(err => {
            console.error('Ошибка загрузки PDF:', err);
            alert('Не удалось загрузить PDF-файл.');
            closePdfViewer();
        });
    };

    const closePdfViewer = () => {
        pdfViewerModal.classList.add('hidden');
        pdfDoc = null;
    };

    document.body.addEventListener('click', e => {
        const pdfButton = e.target.closest('.pdf-button[data-pdf-url]');
        if (pdfButton) {
            openPdfViewer(pdfButton.dataset.pdfUrl);
        }
    });

    pdfCloseButton.addEventListener('click', closePdfViewer);
});
