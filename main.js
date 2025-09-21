
const marathonData = [
    { day: -1, title: 'Подготовка: День 1', postImage: 'https://images.unsplash.com/photo-1543353071-873f6b6a6a89?q=80&w=2070&auto=format&fit=crop', postText: 'Приветствие, полезные привычки и основы интервального питания. Готовимся к марафону правильно.', videos: ['G_h_iAYd-b4', '8_Rfe3A-d4', 'h6_n05B6h3A'], pdf: './spisok_produktov.pdf', pdfButtonText: 'Скачать список продуктов' },
    { day: 0, title: 'Подготовка: День 2', postImage: 'https://images.unsplash.com/photo-1528712306095-ed8633fec3f4?q=80&w=1974&auto=format&fit=crop', postText: 'Сегодня мы составляем меню на время марафона. Правильное питание - ключ к успеху.', videos: [], pdf: './menu.pdf', pdfButtonText: 'Скачать меню' },
    { day: 1, title: 'День 1: Мозг - наш союзник', postImage: 'https://images.unsplash.com/photo-1516534778568-6e4c088a2485?q=80&w=2070&auto=format&fit=crop', postText: 'Как использовать силу своего мозга для достижения целей. Работаем с мотивацией.', videos: ['5qap5aO4i9A'], pdf: null },
    { day: 2, title: 'День 2: Лимфатическая система', postImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop', postText: 'Разгоняем лимфу для избавления от отеков и улучшения самочувствия. Смотрите видео с упражнениями.', videos: ['g_tea8ZN-mQ', '9vPE_aR_I_4', 't0kACis_d3U', 'a-x32b-a_yQ'], pdf: null },
    { day: 3, title: 'День 3: Медитация и дыхание', postImage: 'https://images.unsplash.com/photo-1506126613408-4e61f36d50da?q=80&w=2070&auto=format&fit=crop', postText: 'Учимся техникам расслабления, которые помогут справиться со стрессом и улучшить концентрацию.', videos: ['o7E_9a3e2I4', 'G_h_iAYd-b4', '8_Rfe3A-d4'], pdf: null },
    { day: 4, title: 'День 4: Правило тарелки', postImage: 'https://images.unsplash.com/photo-1556761175-5973693df316?q=80&w=1974&auto=format&fit=crop', postText: 'Простой и эффективный способ сбалансировать свой рацион без подсчета калорий.', videos: ['h6_n05B6h3A', '5qap5aO4i9A'], pdf: null },
    { day: 5, title: 'День 5: Важность БАДов', postImage: 'https://images.unsplash.com/photo-1607619056574-7d8d3ee536b2?q=80&w=2146&auto=format&fit=crop', postText: 'Разбираемся, какие добавки действительно нужны нашему организму и как их правильно принимать.', videos: ['I-ovzUNq6sU'], pdf: null },
    { day: 6, title: 'День 6: Интеграция', postImage: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?q=80&w=2070&auto=format&fit=crop', postText: 'Закрепляем полученные знания и готовимся применять их в повседневной жизни. Свободная тема.', videos: ['g_tea8ZN-mQ'], pdf: null },
    { day: 7, title: 'День 7: Новая жизнь', postImage: 'https://images.unsplash.com/photo-1475694867822-f0d3b134a530?q=80&w=2070&auto=format&fit=crop', postText: 'Подводим итоги и строим планы на будущее. Вы на верном пути к здоровью и красоте!', videos: ['9vPE_aR_I_4'], pdf: null }
];

const supplementaryData = {
    recipes: { title: 'Рецепты', content: 'Сборник здоровых и вкусных рецептов на каждый день.', link: './recipes.pdf' },
    desserts: { title: 'Десерты', content: 'Полезные десерты, которые можно есть без вреда для фигуры.', link: './desserts.pdf' },
    checkup: { title: 'Чек-ап здоровья', content: 'Список анализов, которые стоит сдавать регулярно для контроля своего здоровья.', link: './checkup.pdf' }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- Page Elements ---
    const landingPage = document.getElementById('landing-page');
    const mainPage = document.getElementById('main-page');
    const contentModal = document.getElementById('content-modal');
    const pdfViewerModal = document.getElementById('pdf-viewer-modal');
    const bottomNav = document.getElementById('bottom-nav');
    
    // --- Buttons ---
    const startButton = document.getElementById('start-button');
    const closeModalButton = document.getElementById('close-modal-button');
    const homeButton = document.getElementById('home-button');
    const closePdfButton = pdfViewerModal.querySelector('.close-pdf-modal');

    // --- Content Containers ---
    const daysContainer = document.querySelector('.days-container');
    const supplementaryButtons = document.querySelector('.supplementary-buttons');
    const modalContentArea = document.getElementById('modal-content-area');
    const pdfViewerIframe = pdfViewerModal.querySelector('iframe');

    // --- App Logic ---

    // Hide nav on the landing page
    bottomNav.classList.add('hidden');

    const showMainMenu = () => {
        landingPage.classList.add('hidden');
        mainPage.classList.remove('hidden');
        bottomNav.classList.remove('hidden'); // Show nav for the main app
        closeContentModal(); // Ensure content modal is closed
    };

    // 1. Start App
    startButton.addEventListener('click', showMainMenu);

    // 2. Populate Main Menu
    marathonData.forEach(day => {
        const button = document.createElement('button');
        button.innerText = day.day < 1 ? `Подготовка ${day.day + 2}` : `День ${day.day}`;
        button.dataset.day = day.day;
        daysContainer.appendChild(button);
    });

    // 3. Open Content Modal
    const openContentModal = (htmlContent) => {
        modalContentArea.innerHTML = htmlContent;
        contentModal.classList.remove('hidden');
        contentModal.scrollTop = 0;
    };

    daysContainer.addEventListener('click', e => {
        const button = e.target.closest('button[data-day]');
        if (!button) return;
        const dayData = marathonData.find(d => d.day == button.dataset.day);
        if (!dayData) return;
        const videosHtml = dayData.videos.length > 0 
            ? `<h4>Видео-материалы дня</h4><div class="video-container">${dayData.videos.map(id => `<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`).join('')}</div>` 
            : '';
        const pdfButtonHtml = dayData.pdf
            ? `<h4>Полезные материалы</h4><button class="pdf-button" data-pdf-url="${dayData.pdf}">${dayData.pdfButtonText || 'Читать PDF'}</button>`
            : '';
        const modalHtml = `
            <img src="${dayData.postImage}" alt="${dayData.title}" class="post-image">
            <h3>${dayData.title}</h3>
            <p>${dayData.postText}</p>
            ${videosHtml}
            ${pdfButtonHtml}
        `;
        openContentModal(modalHtml);
    });

    supplementaryButtons.addEventListener('click', e => {
        const button = e.target.closest('button[data-supplement]');
        if (!button) return;
        const key = button.dataset.supplement;
        const data = supplementaryData[key];
        if (!data) return;
        const modalHtml = `
            <h3>${data.title}</h3>
            <p>${data.content}</p>
            <button class="pdf-button" data-pdf-url="${data.link}"><i class='bx bxs-file-pdf'></i> Открыть файл</button>
        `;
        openContentModal(modalHtml);
    });

    // 4. Close Content Modal
    const closeContentModal = () => {
        contentModal.classList.add('hidden');
        modalContentArea.innerHTML = ''; // Clear content
    };
    
    closeModalButton.addEventListener('click', closeContentModal);
    homeButton.addEventListener('click', showMainMenu);

    // 5. PDF Viewer Logic
    const openPdfViewer = (url) => {
        pdfViewerIframe.src = url;
        pdfViewerModal.classList.remove('hidden');
    };

    const closePdfViewer = () => {
        pdfViewerModal.classList.add('hidden');
        pdfViewerIframe.src = ''; // Clear src to stop loading
    };

    modalContentArea.addEventListener('click', e => {
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
