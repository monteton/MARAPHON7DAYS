
document.addEventListener('DOMContentLoaded', () => {

    // --- Page Elements ---
    const landingPage = document.getElementById('landing-page');
    const mainPage = document.getElementById('main-page');
    const pdfViewerModal = document.getElementById('pdf-viewer-modal');
    const bottomNav = document.getElementById('bottom-nav');
    const contentPages = document.querySelectorAll('.page-content');

    // --- Buttons ---
    const startButton = document.getElementById('start-button');
    const homeButton = document.getElementById('home-button');
    const closePdfButton = pdfViewerModal.querySelector('.close-pdf-modal');
    const mainPageButtons = document.querySelectorAll('[data-target]');
    const closePageButtons = document.querySelectorAll('.close-page-button');

    // --- PDF Viewer ---
    const pdfViewerIframe = pdfViewerModal.querySelector('iframe');

    // --- App Logic ---

    // 1. Initial State: Hide nav on landing page
    bottomNav.classList.add('hidden');

    // Function to show the main menu
    const showMainMenu = () => {
        landingPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        bottomNav.classList.remove('hidden');
        // Hide all content pages
        contentPages.forEach(page => page.classList.add('hidden'));
    };

    // 2. Start App
    startButton.addEventListener('click', showMainMenu);
    homeButton.addEventListener('click', showMainMenu);

    // 3. Open Content Page
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

    // 5. PDF Viewer Logic
    const openPdfViewer = (url) => {
        pdfViewerIframe.src = url;
        pdfViewerModal.classList.remove('hidden');
    };

    const closePdfViewer = () => {
        pdfViewerModal.classList.add('hidden');
        pdfViewerIframe.src = ''; // Clear src to stop loading
    };

    // Add listeners to all PDF buttons inside content pages
    document.body.addEventListener('click', e => {
        const pdfButton = e.target.closest('.pdf-button[data-pdf-url]');
        if (pdfButton) {
            openPdfViewer(pdfButton.dataset.pdfUrl);
        }
    });

    closePdfButton.addEventListener('click', closePdfViewer);
    pdfViewerModal.addEventListener('click', (e) => {
        if (e.target === pdfViewerModal) closePdfViewer();
    });

});
