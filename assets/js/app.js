// RCL Engineering Issue Reporting App
const app = {
    currentPage: 'home',
    isLoggedIn: false,
    
    // Initialize the app
    init() {
        this.loadTickets();
        this.setupEventListeners();
        this.checkLoginStatus();
        console.log('RCL Engineering App Initialized');
        if (window.localStorage) {
            localStorage.getItem = localStorage.getItem.bind(localStorage);
            localStorage.setItem = localStorage.setItem.bind(localStorage);
            localStorage.removeItem = localStorage.removeItem.bind(localStorage);
            localStorage.clear = localStorage.clear.bind(localStorage);
        }
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Issue form submission
        const issueForm = document.getElementById('issueForm');
        if (issueForm) {
            issueForm.addEventListener('submit', (e) => this.handleIssueSubmit(e));
        }
        
        // Urgency slider
        const urgencySlider = document.getElementById('urgencySlider');
        if (urgencySlider) {
            urgencySlider.addEventListener('change', () => this.updateUrgencyLabel());
        }
        
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    },
    
    // Navigate between pages
    navigate(page, ticketId = null) {
        // If trying to access login but already logged in with valid session, go to dashboard
        if (page === 'login' && this.isLoggedIn) {
            const expiryTime = localStorage.getItem('rcl_session_expiry');
            if (expiryTime && Date.now() <= parseInt(expiryTime)) {
                page = 'admin-dashboard';
            }
        }
        
        // If trying to access dashboard but not logged in, go to login
        if (page === 'admin-dashboard' && !this.isLoggedIn) {
            page = 'login';
        }
        
        const pages = {
            'home': config.ROOT + 'index.html',
            'report': config.ROOT + 'report-issue.html',
            'success': config.ROOT + 'success.html',
            'login': config.ROOT + 'admin/login.html',
            'admin-dashboard': config.ROOT + 'admin/dashboard.html',
            'ticket-details': config.ROOT + 'ticket-details.html'
        };
        
        if (pages[page]) {
            let url = pages[page];
            if (page === 'ticket-details' && ticketId) {
                url += '?ticketId=' + ticketId;
                localStorage.setItem('currentTicketId', ticketId);
            }
            window.location.href = url;
            this.currentPage = page;
        }
    },
    
    // Handle issue form submission
    handleIssueSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const ticket = {
            id: this.generateTicketId(),
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email') || 'Not provided',
            company: formData.get('company'),
            location: formData.get('location'),
            category: formData.get('category'),
            specificLocation: formData.get('specificLocation'),
            description: formData.get('description'),
            urgency: parseInt(formData.get('urgency')),
            status: 'Pending',
            dateSubmitted: new Date().toLocaleString(),
            timestamp: Date.now()
        };
        
        // Get existing tickets
        let tickets = JSON.parse(localStorage.getItem('rcl_tickets')) || [];
        tickets.push(ticket);
        
        // Save to localStorage
        localStorage.setItem('rcl_tickets', JSON.stringify(tickets));
        
        // Store current ticket for success page
        localStorage.setItem('rcl_lastTicket', JSON.stringify(ticket));
        
        // Redirect to success page
        setTimeout(() => {
            window.location.href = config.ROOT + 'success.html';
        }, 500);
    },
    
    // Load and display tickets on success page
    displaySuccessTicket() {
        const ticket = JSON.parse(localStorage.getItem('rcl_lastTicket'));
        if (ticket) {
            document.getElementById('summaryCategory').textContent = ticket.category;
            document.getElementById('summaryUrgency').textContent = this.getUrgencyLevel(ticket.urgency);
            document.getElementById('summaryId').textContent = ticket.id;
            document.getElementById('summaryDate').textContent = ticket.dateSubmitted;
        }
    },
    
    // Update urgency label based on slider value
    updateUrgencyLabel() {
        const slider = document.getElementById('urgencySlider');
        const value = document.getElementById('urgencyValue');
        const urgencyValue = parseInt(slider.value);
        const labels = ['', '1 - Low', '2 - Low', '3 - Medium', '4 - High', '5 - Critical'];
        value.textContent = labels[urgencyValue];
    },
    
    // Generate unique ticket ID
    generateTicketId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `RCL-${timestamp}-${random}`;
    },
    
    // Get urgency level text
    getUrgencyLevel(value) {
        const levels = {
            1: 'Low Priority',
            2: 'Low Priority',
            3: 'Medium Priority',
            4: 'High Priority',
            5: 'Critical Priority'
        };
        return levels[value] || 'Medium Priority';
    },
    
    // Handle admin login
    handleLogin(e) {
        e.preventDefault();
        
        const adminId = document.getElementById('admin_id').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        
        // Simple demo authentication
        if (adminId === config.ADMIN_ID && password === config.ADMIN_PASSWORD) {
            const loginTime = Date.now();
            
            // Set session expiry (8 hours if remember me, otherwise session only)
            const expiryTime = rememberMe ? loginTime + (8 * 60 * 60 * 1000) : loginTime + (60 * 60 * 1000); // 8 hours or 1 hour
            
            localStorage.setItem('rcl_authed', 'true');
            localStorage.setItem('rcl_admin_name', 'Admin User');
            localStorage.setItem('rcl_login_time', loginTime.toString());
            localStorage.setItem('rcl_session_expiry', expiryTime.toString());
            localStorage.setItem('rcl_remember_me', rememberMe.toString());
            
            this.isLoggedIn = true;
            
            // Redirect to admin dashboard
            setTimeout(() => {
                window.location.href = config.ROOT + 'admin/dashboard.html';
            }, 500);
        } else {
            alert('Invalid credentials. Please check your username and password.');
        }
    },
    
    // Check login status
    checkLoginStatus() {
        const isAuthed = localStorage.getItem('rcl_authed') === 'true';
        const expiryTime = localStorage.getItem('rcl_session_expiry');
        
        // Check if session has expired
        if (isAuthed && expiryTime) {
            const currentTime = Date.now();
            if (currentTime > parseInt(expiryTime)) {
                // Session expired, log them out
                this.logout();
                return;
            }
        }
        
        this.isLoggedIn = isAuthed;
        if (!this.isLoggedIn && (window.location.pathname.includes('admin/dashboard') || window.location.pathname.includes('ticket-details'))) {
            window.location.href = config.ROOT + 'admin/login.html';
        }
    },
    
    // Logout
    logout() {
        localStorage.removeItem('rcl_authed');
        localStorage.removeItem('rcl_admin_name');
        localStorage.removeItem('rcl_login_time');
        localStorage.removeItem('rcl_session_expiry');
        localStorage.removeItem('rcl_remember_me');
        this.isLoggedIn = false;
        window.location.href = config.ROOT + 'index.html';
    },
    
    // Load tickets for admin dashboard
    loadTickets() {
        if (window.location.pathname.includes('admin/dashboard')) {
            this.displayAdminDashboard();
        }
        
        if (window.location.pathname.includes('ticket-details')) {
            // Ticket details will be loaded by the page's own DOMContentLoaded event
        }
        
        if (window.location.pathname.includes('success')) {
            this.displaySuccessTicket();
        }
    },
    
    // Display admin dashboard
    displayAdminDashboard() {
        const tickets = JSON.parse(localStorage.getItem('rcl_tickets')) || [];
        
        // Update stats
        document.getElementById('totalTickets').textContent = tickets.length;
        
        const pending = tickets.filter(t => t.status === 'Pending').length;
        const inProgress = tickets.filter(t => t.status === 'In-Progress').length;
        const completed = tickets.filter(t => t.status === 'Completed').length;
        
        document.getElementById('pendingTickets').textContent = pending;
        document.getElementById('inProgressTickets').textContent = inProgress;
        document.getElementById('completedTickets').textContent = completed;
        
        // Display tickets in table
        const tableBody = document.getElementById('ticketTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (tickets.length === 0) {
            tableBody.innerHTML = '<tr class="hover:bg-gray-50 transition-colors"><td colspan="6" class="px-6 py-8 text-center text-gray-500">No tickets yet. Submitted issues will appear here.</td></tr>';
            return;
        }
        
        // Sort by timestamp descending
        tickets.sort((a, b) => b.timestamp - a.timestamp);
        
        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';
            
            const statusColor = {
                'Pending': 'bg-red-50 text-red-700 border-red-200',
                'In-Progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
                'Completed': 'bg-green-50 text-green-700 border-green-200'
            };
            
            const urgencyColor = {
                1: 'bg-green-50 text-green-700',
                2: 'bg-yellow-50 text-yellow-700',
                3: 'bg-orange-50 text-orange-700',
                4: 'bg-red-50 text-red-700',
                5: 'bg-red-100 text-red-900'
            };
            
            const color = statusColor[ticket.status] || 'bg-gray-50 text-gray-700';
            const urgencyColor2 = urgencyColor[ticket.urgency] || 'bg-gray-50';
            
            // Create cells safely to prevent XSS
            const idCell = document.createElement('td');
            idCell.className = 'px-6 py-4';
            const idLink = document.createElement('a');
            idLink.className = 'text-primary font-bold hover:underline cursor-pointer';
            idLink.onclick = () => app.navigate('ticket-details', ticket.id);
            idLink.textContent = ticket.id;
            idCell.appendChild(idLink);
            
            const dateCell = document.createElement('td');
            dateCell.className = 'px-6 py-4 text-gray-600 text-body-md';
            dateCell.textContent = ticket.dateSubmitted;
            
            const categoryCell = document.createElement('td');
            categoryCell.className = 'px-6 py-4';
            const categorySpan = document.createElement('span');
            categorySpan.className = 'px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded';
            categorySpan.textContent = ticket.category;
            categoryCell.appendChild(categorySpan);
            
            const companyCell = document.createElement('td');
            companyCell.className = 'px-6 py-4 text-sm';
            companyCell.textContent = ticket.company;
            
            const urgencyCell = document.createElement('td');
            urgencyCell.className = 'px-6 py-4';
            const urgencySpan = document.createElement('span');
            urgencySpan.className = `px-2 py-1 ${urgencyColor2} text-xs font-bold rounded`;
            urgencySpan.textContent = this.getUrgencyLevel(ticket.urgency);
            urgencyCell.appendChild(urgencySpan);
            
            const statusCell = document.createElement('td');
            statusCell.className = 'px-6 py-4';
            const statusSelect = document.createElement('select');
            statusSelect.className = `appearance-none w-full border ${color} py-1.5 px-3 pr-8 rounded text-xs font-bold focus:outline-none cursor-pointer`;
            statusSelect.onchange = () => app.updateTicketStatus(ticket.id, statusSelect.value);
            
            const pendingOption = document.createElement('option');
            pendingOption.value = 'Pending';
            pendingOption.textContent = 'PENDING';
            if (ticket.status === 'Pending') pendingOption.selected = true;
            statusSelect.appendChild(pendingOption);
            
            const inProgressOption = document.createElement('option');
            inProgressOption.value = 'In-Progress';
            inProgressOption.textContent = 'IN-PROGRESS';
            if (ticket.status === 'In-Progress') inProgressOption.selected = true;
            statusSelect.appendChild(inProgressOption);
            
            const completedOption = document.createElement('option');
            completedOption.value = 'Completed';
            completedOption.textContent = 'COMPLETED';
            if (ticket.status === 'Completed') completedOption.selected = true;
            statusSelect.appendChild(completedOption);
            
            statusCell.appendChild(statusSelect);
            
            // Append all cells to row
            row.appendChild(idCell);
            row.appendChild(dateCell);
            row.appendChild(categoryCell);
            row.appendChild(companyCell);
            row.appendChild(urgencyCell);
            row.appendChild(statusCell);
            
            tableBody.appendChild(row);
        });
    },
    
    // Update ticket status
    updateTicketStatus(ticketId, newStatus) {
        let tickets = JSON.parse(localStorage.getItem('rcl_tickets')) || [];
        tickets = tickets.map(t => {
            if (t.id === ticketId) {
                t.status = newStatus;
            }
            return t;
        });
        localStorage.setItem('rcl_tickets', JSON.stringify(tickets));
        this.displayAdminDashboard();
    },

    // Display ticket details page
    displayTicketDetails() {
        const ticketId = localStorage.getItem('currentTicketId');
        const tickets = JSON.parse(localStorage.getItem('rcl_tickets')) || [];
        const ticket = tickets.find(t => t.id === ticketId);

        if (!ticket) {
            alert('Ticket not found!');
            window.location.href = config.ROOT + 'admin/dashboard.html';
            return;
        }

        // Set status color
        const statusColorMap = {
            'Pending': 'bg-red-50 text-red-700',
            'In-Progress': 'bg-yellow-50 text-yellow-700',
            'Completed': 'bg-green-50 text-green-700'
        };

        const urgencyColorMap = {
            1: 'bg-green-50 text-green-700',
            2: 'bg-yellow-50 text-yellow-700',
            3: 'bg-orange-50 text-orange-700',
            4: 'bg-red-50 text-red-700',
            5: 'bg-red-100 text-red-900'
        };

        // Populate ticket information safely
        document.getElementById('ticketId').textContent = ticket.id;
        document.getElementById('ticketIdInfo').textContent = ticket.id;
        document.getElementById('submittedOn').textContent = ticket.dateSubmitted;
        
        const statusEl = document.getElementById('ticketStatus');
        statusEl.textContent = ticket.status;
        statusEl.className = `px-3 py-1.5 rounded text-sm font-bold ${statusColorMap[ticket.status] || 'bg-gray-50 text-gray-700'}`;

        const urgencyEl = document.getElementById('ticketUrgency');
        urgencyEl.textContent = this.getUrgencyLevel(ticket.urgency);
        urgencyEl.className = `px-3 py-1.5 rounded text-sm font-bold ${urgencyColorMap[ticket.urgency] || 'bg-gray-50 text-gray-700'}`;

        // Submitted By - use textContent to prevent XSS
        document.getElementById('fullName').textContent = ticket.fullName;
        document.getElementById('email').textContent = ticket.email;
        document.getElementById('phone').textContent = ticket.phone;

        // Issue Details - use textContent to prevent XSS
        document.getElementById('category').textContent = ticket.category;
        document.getElementById('company').textContent = ticket.company;
        document.getElementById('location').textContent = ticket.location;
        document.getElementById('specificLocation').textContent = ticket.specificLocation;
        document.getElementById('description').textContent = ticket.description;

        // Set status dropdown
        document.getElementById('statusSelect').value = ticket.status;
    },

    // Update ticket status from details page
    updateTicketStatusFromDetails() {
        const ticketId = localStorage.getItem('currentTicketId');
        if (!ticketId) {
            alert('Error: No ticket selected');
            return;
        }

        const newStatus = document.getElementById('statusSelect').value;
        
        // Update in storage
        let tickets = JSON.parse(localStorage.getItem('rcl_tickets')) || [];
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            tickets[ticketIndex].status = newStatus;
            localStorage.setItem('rcl_tickets', JSON.stringify(tickets));
            this.displayTicketDetails();
            alert('Ticket status updated successfully!');
        } else {
            alert('Error: Ticket not found');
        }
    },
    

};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
