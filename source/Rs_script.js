// Find this function in your script.js
const showPage = (pageId, pageTitle) => {
    mainHeader.textContent = pageTitle;
    if (pageId === 'dashboard') {
        pageContent.innerHTML = dashboardViewHTML;
        initializeDashboard();
        loadDataFromMyAPI();
    } else if (pageId === 'residents') { // ADD THIS 'ELSE IF' BLOCK
        pageContent.innerHTML = `
            <div id="residents-view">
                <div class="page-header">
                    <div class="search-and-actions">
                        <div class="page-search-bar">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search residents by name...">
                        </div>
                        <button class="action-btn primary"><i class="fas fa-plus"></i> Add New Resident</button>
                        <button class="action-btn"><i class="fas fa-file-csv"></i> Export to CSV</button>
                    </div>
                </div>
                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Address</th>
                                <th>Date Registered</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Juan Dela Cruz</td>
                                <td>28</td>
                                <td>Purok 1, Tugui Grande</td>
                                <td>2025-10-03</td>
                                <td><span class="status-tag active">Active</span></td>
                                <td>
                                    <button class="table-action-btn edit"><i class="fas fa-edit"></i></button>
                                    <button class="table-action-btn delete"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Maria Clara</td>
                                <td>35</td>
                                <td>Purok 3, Tugui Grande</td>
                                <td>2025-10-02</td>
                                <td><span class="status-tag active">Active</span></td>
                                <td>
                                    <button class="table-action-btn edit"><i class="fas fa-edit"></i></button>
                                    <button class="table-action-btn delete"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td>Jose Rizal</td>
                                <td>42</td>
                                <td>Purok 2, Tugui Grande</td>
                                <td>2025-09-28</td>
                                <td><span class="status-tag inactive">Inactive</span></td>
                                <td>
                                    <button class="table-action-btn edit"><i class="fas fa-edit"></i></button>
                                    <button class="table-action-btn delete"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } else { // Keep this 'else' for other pages
        pageContent.innerHTML = `<div class="placeholder-content"><h2>${pageTitle}</h2><p>Content for the ${pageTitle.toLowerCase()} page will be displayed here.</p></div>`;
    }
};