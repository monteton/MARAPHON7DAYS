
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
     * Renders a specific page of the PDF.
     * @param {number} num The page number to render.
     */
    const renderPage = num => {
        pageRendering = true;
        // Get page
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: 2 }); // Default scale
            const context = pdfCanvas.getContext('2d');

            // Adjust canvas size to match the viewport, considering device pixel ratio for sharpness
            const outputScale = window.devicePixelRatio || 1;
            const desiredWidth = pdfCanvasContainer.clientWidth;
            const scale = desiredWidth / viewport.width;
            const scaledViewport = page.getViewport({ scale: scale });

            pdfCanvas.width = Math.floor(scaledViewport.width * outputScale);
            pdfCanvas.height = Math.floor(scaledViewport.height * outputScale);
            pdfCanvas.style.width = Math.floor(scaledViewport.width) + 'px';
            pdfCanvas.style.height = Math.floor(scaledViewport.height) + 'px';
            
            context.scale(outputScale, outputScale);

            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };

            const renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(() => {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page waiting to be rendered
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });

        // Update page counters
        pageNumSpan.textContent = num;
    };

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, renders the page.
     */
    const queueRenderPage = num => {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    };

    // --- PDF Viewer Event Handlers ---

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
     * Asynchronously downloads and opens a PDF.
     * @param {string} url The URL of the PDF.
     */
    const openPdfViewer = (url) => {
        pdfViewerModal.classList.remove('hidden');
        bottomNav.classList.add('hidden'); // Hide nav when viewer is open

        // Asynchronously download PDF
        pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_;
            pageCountSpan.textContent = pdfDoc.numPages;
            pageNum = 1;
            renderPage(pageNum);
        }).catch(err => {
            console.error('Error loading PDF:', err);
            alert('Не удалось загрузить PDF. Пожалуйста, проверьте консоль для получения дополнительной информации.');
            closePdfViewer();
        });
    };

    const closePdfViewer = () => {
        pdfViewerModal.classList.add('hidden');
        bottomNav.classList.remove('hidden');
        pdfDoc = null;
        pageNum = 1;
    };

    // Event listener for all PDF buttons
    document.body.addEventListener('click', e => {
        const pdfButton = e.target.closest('.pdf-button[data-pdf-url]');
        if (pdfButton) {
            openPdfViewer(pdfButton.dataset.pdfUrl);
        }
    });

    pdfCloseButton.addEventListener('click', closePdfViewer);
});
