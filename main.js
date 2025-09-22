document.addEventListener('DOMContentLoaded', () => {

    // --- Page Elements ---
    const landingPage = document.getElementById('landing-page');
    const mainPage = document.getElementById('main-page');
    const bottomNav = document.getElementById('bottom-nav');
    const contentPages = document.querySelectorAll('.page-content');

    // --- Buttons ---
    const startButton = document.getElementById('start-button');
    const homeButton = document.getElementById('home-button');
    const mainPageButtons = document.querySelectorAll('[data-target]');
    const closePageButtons = document.querySelectorAll('.close-page-button');

    // --- PDF.js Viewer Elements ---
    const pdfViewerModal = document.getElementById('pdf-viewer-modal');
    const pdfCloseButton = document.getElementById('pdf-close-button');
    const pdfCanvas = document.getElementById('pdf-canvas');
    const pdfCanvasContainer = document.getElementById('pdf-canvas-container');
    const prevPageButton = document.getElementById('pdf-prev-page');
    const nextPageButton = document.getElementById('pdf-next-page');
    const pageNumSpan = document.getElementById('pdf-page-num');
    const pageCountSpan = document.getElementById('pdf-page-count');

    // --- PDF.js State ---
    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;

    // --- App Logic ---

    // 1. Initial State: Hide nav on landing page
    bottomNav.classList.add('hidden');

    // Function to show the main menu
    const showMainMenu = () => {
        landingPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        bottomNav.classList.remove('hidden');
        contentPages.forEach(page => page.classList.add('hidden'));
    };

    // 2. Start App & Home Button
    startButton.addEventListener('click', showMainMenu);
    homeButton.addEventListener('click', showMainMenu);

    // 3. Open Content Page from Main Menu
    mainPageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                mainPage.classList.add('hidden');
                targetPage.classList.remove('hidden');
                targetPage.scrollTop = 0; // Scroll to top
            }
        });
    });

    // 4. Close Content Page
    closePageButtons.forEach(button => {
        button.addEventListener('click', showMainMenu);
    });

    // --- PDF.js Viewer Logic ---

    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

    /**
     * Renders a specific page of the PDF, fitting it to the container width.
     * @param {number} num The page number to render.
     */
    const renderPage = num => {
        pageRendering = true;

        // Get the page from the document
        pdfDoc.getPage(num).then(page => {
            // --- ИСПРАВЛЕННАЯ ЛОГИКА МАСШТАБИРОВАНИЯ ---

            // 1. Получаем viewport с масштабом 1, чтобы узнать оригинальный размер
            const unscaledViewport = page.getViewport({ scale: 1 });

            // 2. Вычисляем нужный масштаб, чтобы вписать страницу по ширине контейнера.
            //    Отнимаем 20px, чтобы по бокам остались небольшие отступы для эстетики.
            const scale = (pdfCanvasContainer.clientWidth - 20) / unscaledViewport.width;

            // 3. Создаем финальный viewport с правильным, вычисленным масштабом
            const viewport = page.getViewport({ scale: scale });

            // --- КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ---

            const context = pdfCanvas.getContext('2d');
            const outputScale = window.devicePixelRatio || 1;

            // Устанавливаем фактический размер холста с учетом плотности пикселей для четкости
            pdfCanvas.width = Math.floor(viewport.width * outputScale);
            pdfCanvas.height = Math.floor(viewport.height * outputScale);

            // Устанавливаем CSS-размер холста, который видит пользователь
            pdfCanvas.style.width = Math.floor(viewport.width) + 'px';
            pdfCanvas.style.height = Math.floor(viewport.height) + 'px';
            
            context.scale(outputScale, outputScale);

            const renderContext = {
                canvasContext: context,
                viewport: viewport // Используем финальный viewport для отрисовки
            };

            const renderTask = page.render(renderContext);

            // Ждем завершения отрисовки
            renderTask.promise.then(() => {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // Если была запрошена другая страница, пока шла отрисовка, рендерим ее
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });

        // Обновляем счетчик страниц
        pageNumSpan.textContent = num;
    };

    /**
     * Если другая страница уже рендерится, ставит новую в очередь.
     * Иначе, сразу рендерит.
     */
    const queueRenderPage = num => {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    };

    // --- Обработчики событий для PDF-просмотрщика ---

    const onPrevPage = () => {
        if (pageNum <= 1) return;
        pageNum--;
        queueRenderPage(pageNum);
    };
    prevPageButton.addEventListener('click', onPrevPage);

    const onNextPage = () => {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        queueRenderPage(pageNum);
    };
    nextPageButton.addEventListener('click', onNextPage);

    /**
     * Асинхронно загружает и открывает PDF.
     * @param {string} url URL PDF-файла.
     */
    const openPdfViewer = (url) => {
        pdfViewerModal.classList.remove('hidden');
        bottomNav.classList.add('hidden'); // Прячем навигацию при открытом PDF

        // Асинхронная загрузка PDF
        pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            pageCountSpan.textContent = pdfDoc.numPages;
            pageNum = 1; // Всегда начинаем с первой страницы
            renderPage(pageNum);
        }).catch(err => {
            console.error('Error loading PDF:', err);
            alert('Не удалось загрузить PDF. Пожалуйста, проверьте консоль для получения дополнительной информации.');
            closePdfViewer();
        });
    };

    // Функция закрытия PDF-просмотрщика
    const closePdfViewer = () => {
        pdfViewerModal.classList.add('hidden');
        bottomNav.classList.remove('hidden');
        // Сбрасываем состояние
        pdfDoc = null;
        pageNum = 1;
    };

    // Единый обработчик для всех кнопок, открывающих PDF
    document.body.addEventListener('click', e => {
        const pdfButton = e.target.closest('.pdf-button[data-pdf-url]');
        if (pdfButton) {
            openPdfViewer(pdfButton.dataset.pdfUrl);
        }
    });

    // Обработчик для кнопки закрытия PDF
    pdfCloseButton.addEventListener('click', closePdfViewer);
});
