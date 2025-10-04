document.addEventListener('DOMContentLoaded', () => {
    // --- Dashboard Page Logic ---
    const pageContent = document.getElementById('page-content');
    const mainHeader = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.sidebar-nav a, .sidebar-footer a');
    const dashboardViewHTML = pageContent.innerHTML;

    const initializeDashboard = () => {
        if (document.getElementById('totalPopulation')) {
            document.getElementById('totalPopulation').textContent = '0';
            document.getElementById('totalHouseholds').textContent = '0';
            document.getElementById('activeBlotterCases').textContent = '0';
            document.getElementById('permitsIssued').textContent = '0';
            const announcementsList = document.getElementById('announcementsList');
            if(announcementsList) {
                announcementsList.innerHTML = `<li><p class="details">Connecting to database...</p></li>`;
            }
        }
    };

    const updateDashboardUI = (data) => {
        document.getElementById('totalPopulation').textContent = data.stats.population.toLocaleString();
        document.getElementById('totalHouseholds').textContent = data.stats.households.toLocaleString();
        document.getElementById('activeBlotterCases').textContent = data.stats.blotterCases;
        document.getElementById('permitsIssued').textContent = data.stats.permitsIssued;
        const announcementsList = document.getElementById('announcementsList');
        announcementsList.innerHTML = '';
        data.announcements.forEach(item => {
            const listItem = `<li><div class="announcement-icon ${item.iconColor}"><i class="fas ${item.icon}"></i></div><div class="announcement-content"><p class="title">${item.title}</p><p class="details">${item.date} - ${item.description}</p></div></li>`;
            announcementsList.innerHTML += listItem;
        });
    };

    async function loadDataFromMyAPI() {
        try {
            // **Remember to change this URL too when you deploy!**
            const response = await fetch('https://YOUR_API_ENDPOINT_GOES_HERE/barangay/data');
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const myData = await response.json();
            updateDashboardUI(myData);
        } catch (error) {
            console.error('Failed to fetch data from API:', error);
            const announcementsList = document.getElementById('announcementsList');
            if(announcementsList) {
                announcementsList.innerHTML = `<li><p class="details" style="color: red;">Error: Could not connect to the database.</p></li>`;
            }
        }
    }

    const showPage = (pageId, pageTitle) => {
        mainHeader.textContent = pageTitle;
        let content = '';
        if (pageId === 'dashboard') {
            pageContent.innerHTML = dashboardViewHTML;
            initializeDashboard();
            loadDataFromMyAPI();
            return;
        } else if (pageId === 'officials') {
            content = `<div class="officials-grid"><div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Juan Dela Cruz</h4><p>Punong Barangay</p></div><div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Maria Clara</h4><p>Kagawad</p></div></div>`;
        } else if (pageId === 'residents') {
            content = `<div id="residents-view"><div class="page-header"><div class="search-and-actions"><div class="page-search-bar"><i class="fas fa-search"></i><input type="text" placeholder="Search residents by name..."></div><button class="action-btn primary"><i class="fas fa-plus"></i> Add New Resident</button></div></div><div class="data-table-container">...</div></div>`;
        } else {
            content = `<div class="placeholder-content"><h2>${pageTitle}</h2><p>Content for the ${pageTitle.toLowerCase()} page will be displayed here.</p></div>`;
        }
        pageContent.innerHTML = content;
    };
    
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.dataset.page;
            const pageTitle = link.querySelector('span').textContent;
            document.querySelector('.sidebar-nav li.active, .sidebar-footer.active')?.classList.remove('active');
            link.closest('li, .sidebar-footer').classList.add('active');
            showPage(pageId, pageTitle);
        });
    });

    // --- API-Powered Chatbot Logic ---
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatBody = document.getElementById('chat-body');

    const sendMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        appendMessage(userMessage, 'user');
        chatInput.value = '';

        try {
            //
            // === THIS IS THE ADJUSTED LINE FOR DEPLOYMENT ===
            //
            // Replace this URL with the one you get from your Python hosting service (like Render).
            const response = await fetch('https://YOUR_CHATBOT_API_URL_HERE/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const botMessage = data.reply;

            appendMessage(botMessage, 'bot');

        } catch (error) {
            console.error('Error fetching chatbot response:', error);
            appendMessage("Sorry, I'm having trouble connecting to the assistant. Please try again later.", 'bot');
        }
    };

    const appendMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    
    // Event listeners for chatbot
    chatBubble.addEventListener('click', () => chatWindow.classList.toggle('open'));
    closeChatBtn.addEventListener('click', () => chatWindow.classList.remove('open'));
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') sendMessage();
    });

    // --- Main Execution ---
    initializeDashboard();
    loadDataFromMyAPI();
});