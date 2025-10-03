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
    const pdfCanvasContainer = document.getElementById('pdf-canvas-container');
    const pdfViewerTitle = document.getElementById('pdf-viewer-title');

    // --- Логика приложения ---

    // 1. Начальное состояние
    bottomNav.classList.add('hidden');

    // 2. Отображение главного меню
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

    startButton.addEventListener('click', showMainMenu);
    homeButton.addEventListener('click', showMainMenu);

    // 3. Открытие и закрытие страниц
    mainPageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPage = document.getElementById(button.dataset.target);
            if (targetPage) {
                mainPage.classList.add('hidden');
                targetPage.classList.remove('hidden');
                targetPage.scrollTop = 0;
            }
        });
    });

    closePageButtons.forEach(button => {
        button.addEventListener('click', showMainMenu);
    });

    // --- Логика для просмотра PDF ---

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    const openPdfViewer = (url, title) => {
        pdfViewerTitle.textContent = title;
        pdfViewerModal.classList.remove('hidden');
        pdfCanvasContainer.innerHTML = ''; // Очистка перед открытием нового PDF

        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(pdfDoc => {
            const numPages = pdfDoc.numPages;
            const renderAllPages = async () => {
                for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                    const page = await pdfDoc.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    canvas.style.marginBottom = '20px';
                    pdfCanvasContainer.appendChild(canvas);

                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                }
            };
            renderAllPages();
        });
    };

    const closePdfViewer = () => {
        pdfViewerModal.classList.add('hidden');
    };

    document.body.addEventListener('click', e => {
        const pdfButton = e.target.closest('.pdf-button[data-pdf-url]');
        if (pdfButton) {
            const title = pdfButton.textContent.trim();
            openPdfViewer(pdfButton.dataset.pdfUrl, title);
        }
    });

    pdfCloseButton.addEventListener('click', closePdfViewer);
});
