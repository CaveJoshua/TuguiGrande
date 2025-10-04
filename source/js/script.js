/* global lucide, Chart */
document.addEventListener('DOMContentLoaded', function () {

    // --- VIEW & ELEMENT REFERENCES ---
    const portalView = document.getElementById('portal-view');
    const loginScreen = document.getElementById('login-screen');
    const dashboardView = document.getElementById('dashboard-view');
    const portalLoginBtn = document.getElementById('portal-login-btn');
    const backToPortalBtn = document.getElementById('back-to-portal-btn');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    let isDashboardInitialized = false;

    // --- VIEW MANAGEMENT ---
    const showView = (viewToShow) => {
        portalView.style.display = 'none';
        loginScreen.style.display = 'none';
        dashboardView.style.display = 'none';
        viewToShow.style.display = 'block';

        if (viewToShow === loginScreen) {
            loginScreen.style.display = 'flex';
        }
        if (viewToShow === dashboardView && !isDashboardInitialized) {
            initializeDashboard();
        }
    };

    portalLoginBtn.addEventListener('click', () => showView(loginScreen));
    backToPortalBtn.addEventListener('click', () => showView(portalView));

    // --- LOGIN/LOGOUT LOGIC ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'admin' && password === 'password123') {
            showView(dashboardView);
        } else {
            document.getElementById('login-error').classList.remove('hidden');
        }
    });

    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        showView(portalView);
    });
    
    // --- CHATBOT LOGIC ---
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    const adminChatForm = document.getElementById('admin-chat-form');
    const adminChatInput = document.getElementById('admin-chat-input');
    const adminChatMessages = document.getElementById('admin-chat-messages');

    const toggleChatWindow = () => {
        chatWindow.classList.toggle('hidden');
    };

    chatBubble.addEventListener('click', toggleChatWindow);
    closeChatBtn.addEventListener('click', toggleChatWindow);

    const addMessage = (message, sender, container) => {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}-message`;
        messageElement.textContent = message;
        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;
    };

    const showTypingIndicator = (container) => {
        const typingElement = document.createElement('div');
        typingElement.className = 'chat-message bot-message typing-indicator';
        typingElement.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingElement);
        container.scrollTop = container.scrollHeight;
        return typingElement;
    };

    const getChatbotResponse = async (userMessage) => {
        // =================================================================
        // ==  PLACE YOUR CHATBOT API DETAILS HERE  ==
        // =================================================================
        const API_ENDPOINT = 'YOUR_API_ENDPOINT_HERE'; // e.g., 'https://api.openai.com/v1/chat/completions'
        const API_KEY = 'YOUR_API_KEY_HERE';           // e.g., 'sk-...'

        // If you don't have an API, the chatbot will use this demo response.
        // DELETE this block when you add your real API call.
        // ------------- START DEMO RESPONSE -------------
        return new Promise(resolve => {
            setTimeout(() => {
                resolve("This is a simulated response. Please replace this logic with your actual API call in script.js.");
            }, 1500);
        });
        // -------------- END DEMO RESPONSE --------------


        /*
        // --- EXAMPLE API CALL (for something like OpenAI's API) ---
        // Uncomment and adapt this section once you have your API details.
        
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // Or whichever model you use
                    messages: [{ role: "user", content: userMessage }]
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error("Chatbot API error:", error);
            return "Sorry, I'm having trouble connecting to my brain right now. Please try again later.";
        }
        */
    };

    const handleChatSubmit = async (event, inputElement, messagesContainer) => {
        event.preventDefault();
        const userMessage = inputElement.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user', messagesContainer);
        inputElement.value = '';

        const typingIndicator = showTypingIndicator(messagesContainer);
        const botResponse = await getChatbotResponse(userMessage);
        typingIndicator.remove();
        
        addMessage(botResponse, 'bot', messagesContainer);
    };

    chatForm.addEventListener('submit', (e) => handleChatSubmit(e, chatInput, chatMessages));
    adminChatForm.addEventListener('submit', (e) => handleChatSubmit(e, adminChatInput, adminChatMessages));

    // --- DASHBOARD INITIALIZATION & LOGIC ---
    function initializeDashboard() {
        if (isDashboardInitialized) return;
        
        // Dashboard variables
        const sidebarLinks = document.querySelectorAll('#dashboard-view .sidebar-link');
        const pageContents = document.querySelectorAll('#dashboard-view .page-content');
        const pageTitle = document.getElementById('page-title');
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        
        // Date Header
        document.getElementById('current-date-header').textContent = new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        // Navigation
        const navigateToPage = (page) => {
            pageContents.forEach(content => content.classList.add('hidden'));
            const activePage = document.getElementById(`${page}-page`);
            if (activePage) activePage.classList.remove('hidden');
            
            const correspondingLink = document.querySelector(`.sidebar-link[data-page="${page}"]`);
            if(correspondingLink) {
                pageTitle.textContent = correspondingLink.textContent.trim();
                sidebarLinks.forEach(l => l.classList.remove('active'));
                correspondingLink.classList.add('active');
            }
            if(window.innerWidth < 1024) sidebar.classList.add('-translate-x-full');
        };

        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                if(page) navigateToPage(page);
            });
        });

        // Mobile Sidebar
        const manageSidebar = () => {
             if (window.innerWidth >= 1024) sidebar.classList.remove('-translate-x-full');
             else sidebar.classList.add('-translate-x-full');
        };
        menuToggle.addEventListener('click', () => sidebar.classList.toggle('-translate-x-full'));
        window.addEventListener('resize', manageSidebar);
        manageSidebar();
        
        // Chart.js
        const ctx = document.getElementById('populationChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Children', 'Teens', 'Adults', 'Seniors'],
                datasets: [{
                    label: 'Population by Age Group',
                    data: [2500, 1800, 4950, 1000],
                    backgroundColor: '#38bdf8',
                    borderColor: '#0284c7',
                    borderWidth: 1
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });

        isDashboardInitialized = true;
    }

    // --- INITIALIZE APP ---
    lucide.createIcons();
    showView(portalView); // Start on the public portal
});