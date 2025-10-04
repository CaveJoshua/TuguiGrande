/* global lucide, Chart */ // Informs the linter that these are global variables.
document.addEventListener('DOMContentLoaded', function () {
    
    // --- DOM Element Variables ---
    const loginScreen = document.getElementById('login-screen');
    const appWrapper = document.getElementById('app-wrapper');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');
    
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('page-title');
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const quickActionLinks = document.querySelectorAll('.quick-action-link');

    // --- Login/Logout Logic ---
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple validation for demonstration
        if (username === 'admin' && password === 'password123') {
            loginScreen.classList.add('hidden');
            appWrapper.classList.remove('hidden');
            appWrapper.classList.add('flex');
            initializeDashboard(); // Initialize dashboard components after login
        } else {
            loginError.classList.remove('hidden');
        }
    });

    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        appWrapper.classList.add('hidden');
        appWrapper.classList.remove('flex');
        loginScreen.classList.remove('hidden');
        document.getElementById('username').value = 'admin';
        document.getElementById('password').value = 'password123';
        loginError.classList.add('hidden');
    });

    // --- Page Navigation Logic ---
    const navigateToPage = (page) => {
        // Hide all pages
        pageContents.forEach(content => {
            content.classList.add('hidden');
        });

        // Show the selected page
        const activePage = document.getElementById(page + '-page');
        if (activePage) {
            activePage.classList.remove('hidden');
        }
        
        // Find corresponding sidebar link and update title/style
        const correspondingLink = document.querySelector(`.sidebar-link[data-page="${page}"]`);
        if(correspondingLink) {
            pageTitle.textContent = correspondingLink.textContent.trim();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            correspondingLink.classList.add('active');
        }

        // Close sidebar on mobile after click
        if(window.innerWidth < 1024) {
            sidebar.classList.add('-translate-x-full');
        }
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.dataset.page;
            if(page) navigateToPage(page);
        });
    });

    quickActionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateToPage(page);
        });
    });

    // --- Mobile Sidebar Toggle ---
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
    });
    
    // --- Responsive Sidebar Management ---
    const manageSidebar = () => {
        if (window.innerWidth >= 1024) {
            sidebar.classList.remove('-translate-x-full');
        } else {
            sidebar.classList.add('-translate-x-full');
        }
    };
    window.addEventListener('resize', manageSidebar);
    
    // --- Dashboard Initialization Function ---
    function initializeDashboard() {
        // Initialize Lucide Icons
        lucide.createIcons();

        // Set initial state for mobile sidebar
        manageSidebar();

        // --- Chart.js Example ---
        // Check if chart already exists, destroy before creating new one
        if (window.populationChart instanceof Chart) {
            window.populationChart.destroy();
        }
        const ctx = document.getElementById('populationChart').getContext('2d');
        window.populationChart = new Chart(ctx, { // Store chart instance globally to manage it
            type: 'bar',
            data: {
                labels: ['Children (0-12)', 'Teens (13-19)', 'Adults (20-59)', 'Seniors (60+)'],
                datasets: [{
                    label: 'Population by Age Group',
                    data: [2500, 1800, 4950, 1000],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

});

