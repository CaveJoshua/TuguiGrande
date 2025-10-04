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
            const response = await fetch('https://YOUR_API_ENDPOINT_GOES_HERE/barangay/data');
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            const myData = await response.json();
            updateDashboardUI(myData);
        } catch (error) => {
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
            content = `
                <div class="officials-grid">
                    <div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Juan Dela Cruz</h4><p>Punong Barangay</p></div>
                    <div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Maria Clara</h4><p>Kagawad</p></div>
                    <div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Jose Rizal</h4><p>Kagawad</p></div>
                    <div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Andres Bonifacio</h4><p>SK Chairman</p></div>
                    <div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Gabriela Silang</h4><p>Barangay Secretary</p></div>
                    <div class="official-card"><div class="photo-placeholder"><i class="fas fa-user-tie"></i></div><h4>Apolinario Mabini</h4><p>Barangay Treasurer</p></div>
                </div>`;
        } else if (pageId === 'residents' || pageId === 'blotter') {
            const isResidents = pageId === 'residents';
            content = `
                <div id="${pageId}-view">
                    <div class="page-header"><div class="search-and-actions"><div class="page-search-bar"><i class="fas fa-search"></i><input type="text" placeholder="Search by name..."></div><button class="action-btn primary"><i class="fas fa-plus"></i> Add New ${isResidents ? 'Resident' : 'Record'}</button><button class="action-btn"><i class="fas fa-file-csv"></i> Export to CSV</button></div></div>
                    <div class="data-table-container">
                        <table class="data-table">
                            <thead><tr><th>${isResidents ? 'Name' : 'Case No.'}</th><th>${isResidents ? 'Address' : 'Incident'}</th><th>${isResidents ? 'Date Registered' : 'Date Reported'}</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                ${isResidents ? `<tr><td>Juan Dela Cruz</td><td>Purok 1, Tugui Grande</td><td>2025-10-03</td><td><span class="status-tag active">Active</span></td><td><button class="table-action-btn edit"><i class="fas fa-edit"></i></button><button class="table-action-btn delete"><i class="fas fa-trash"></i></button></td></tr><tr><td>Maria Clara</td><td>Purok 3, Tugui Grande</td><td>2025-10-02</td><td><span class="status-tag active">Active</span></td><td><button class="table-action-btn edit"><i class="fas fa-edit"></i></button><button class="table-action-btn delete"><i class="fas fa-trash"></i></button></td></tr>` : `<tr><td>2025-001</td><td>Theft</td><td>2025-10-01</td><td><span class="status-tag open">Open</span></td><td><button class="table-action-btn edit"><i class="fas fa-edit"></i></button><button class="table-action-btn delete"><i class="fas fa-trash"></i></button></td></tr><tr><td>2025-002</td><td>Public Disturbance</td><td>2025-09-30</td><td><span class="status-tag closed">Closed</span></td><td><button class="table-action-btn edit"><i class="fas fa-edit"></i></button><button class="table-action-btn delete"><i class="fas fa-trash"></i></button></td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>`;
        } else if (pageId === 'permits') {
            content = `
                <div class="grid-container">
                    <div class="option-card"><div class="icon"><i class="fas fa-file-signature"></i></div><h4>Barangay Clearance</h4><p>Request a clearance for employment, business, or other legal purposes.</p></div>
                    <div class="option-card"><div class="icon"><i class="fas fa-home"></i></div><h4>Business Permit</h4><p>Apply for a permit to operate a business within the barangay.</p></div>
                    <div class="option-card"><div class="icon"><i class="fas fa-hard-hat"></i></div><h4>Construction Permit</h4><p>Secure a permit for building or renovating structures.</p></div>
                     <div class="option-card"><div class="icon"><i class="fas fa-leaf"></i></div><h4>Certificate of Indigency</h4><p>Request a certificate for medical or educational assistance.</p></div>
                </div>`;
        } else if (pageId === 'announcements') {
            content = `
                <div>
                    <div class="announcement-post"><h4>Community Cleanup Drive this Weekend</h4><p class="meta">Posted by: Admin User on October 04, 2025</p><p>All residents of Barangay Bani are invited to join a community-wide cleanup drive on Saturday, October 11, 2025, starting at 6:00 AM. Assembly will be at the Barangay Hall. Please bring your own cleaning materials.</p></div>
                    <div class="announcement-post"><h4>Free Vaccination Program for Children</h4><p class="meta">Posted by: Admin User on October 01, 2025</p><p>The Barangay Health Center will be conducting a free vaccination program for children aged 0-5 years old on October 15, 2025. Please bring your child's vaccination card.</p></div>
                </div>`;
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
            const response = await fetch('https://YOUR_CHATBOT_API_URL_HERE/api/google-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const botMessage = data.reply;
            appendMessage(botMessage, 'bot');
        } catch (error) {
            console.error('Error fetching AI response:', error);
            appendMessage("Sorry, I'm having trouble connecting to the AI assistant.", 'bot');
        }
    };
    const appendMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        messageElement.textContent = message;
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight;
    };
    chatBubble.addEventListener('click', () => chatWindow.classList.toggle('open'));
    closeChatBtn.addEventListener('click', () => chatWindow.classList.remove('open'));
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => { if (event.key === 'Enter') sendMessage(); });

    initializeDashboard();
    loadDataFromMyAPI();
});
