// Storage utility to handle localStorage binding correctly
const storageUtil = {
    getItem: window.localStorage.getItem.bind(window.localStorage),
    setItem: window.localStorage.setItem.bind(window.localStorage),
    removeItem: window.localStorage.removeItem.bind(window.localStorage)
};

const supabaseClient = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_ANON_KEY
);

// RCL Engineering Issue Reporting App
const app = {
    currentPage: 'home',
    isLoggedIn: false,
    
    // Initialize the app
    async init() {
        // Wait for session check to complete
        await this.checkLoginStatus();
        this.setupEventListeners();

        const path = window.location.pathname;

        // Protected pages – require login
        if (path.includes('admin/dashboard') || path.includes('ticket-details')) {
            if (!this.isLoggedIn) {
                this.navigate('login');
                return;
            }
        }

        // Page-specific initialisation
        if (path.includes('admin/dashboard')) {
            this.loadTickets();
        } 
        else if (path.includes('ticket-details')) {
            // Read ticketId from URL query string
            const urlParams = new URLSearchParams(window.location.search);
            const ticketId = urlParams.get('ticketId');
            if (!ticketId) {
                alert('No ticket ID provided.');
                this.navigate('admin-dashboard');
                return;
            }
            storageUtil.setItem('currentTicketId', ticketId);
            this.displayTicketDetails();
        }
        else if (path.includes('success')) {
            this.displaySuccessTicket();
        }

        console.log('RCL Engineering App Initialized');
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
        // If trying to access login but already logged in with valid session
        if (page === 'login' && this.isLoggedIn) {
            page = 'admin-dashboard';
        }
        // If trying to access dashboard or ticket-details but not logged in
        if ((page === 'admin-dashboard' || page === 'ticket-details') && !this.isLoggedIn) {
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
                storageUtil.setItem('currentTicketId', ticketId);
            }
            window.location.href = url;
            this.currentPage = page;
        }
    },
    
    // Handle issue form submission
    // Make sure supabase client is initialized outside your component/class
    async handleIssueSubmit(e) {
        e.preventDefault();  // already prevents default

        const formData = new FormData(e.target);  // e.target is the form
        
        const imageFiles = Array.from(formData.getAll('imageProofs')).filter(f => f.size > 0);
        if (imageFiles.length === 0) {
            alert('Please provide at least one image proof of the issue.');
            return;
}
        const ticket = {
            ticket_id: this.generateTicketId(),   // use this.methodName()
            full_name: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email') || 'Not provided',
            company: formData.get('company'),
            location: formData.get('location'),
            category: formData.get('category'),
            specific_location: formData.get('specificLocation'),
            description: formData.get('description'),
            urgency: parseInt(formData.get('urgency')),
            status: 'Open',
            date_submitted: new Date().toISOString(),  // ✅ ISO format
            attachments: []
            // timestamp: Date.now()  // optional – you can omit
        };

        // Upload files to Supabase Storage
        const contractFiles = Array.from(formData.getAll('contractProofs')).filter(f => f.size > 0);
        const allFiles = [...imageFiles, ...contractFiles];

        if (allFiles.length > 0) {
            try {
                const uploadedUrls = await this.uploadFiles(allFiles, ticket.ticket_id);
                ticket.attachments = uploadedUrls;
            } catch (err) {
                console.error('File upload failed:', err);
                alert('Failed to upload one or more files. Please try again.');
                return; // stop submission
            }
        }

        try {
            const { error } = await supabaseClient
                .from('tickets')
                .insert([ticket]);

            if (error) throw error;

            if (!error) {
                storageUtil.setItem('rcl_lastTicket', JSON.stringify(ticket));
                this.navigate('success');
            }
        } catch (err) {
            console.error('Supabase insert error:', err);
            alert('Failed to submit ticket. Please try again.');
            // Do NOT redirect – stay on the form
        }
    },    

    // Helper: upload multiple files to Supabase Storage
    async uploadFiles(files, ticketId) {
        const uploaded = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // Create a unique path: ticketId/timestamp_filename
            const ext = file.name.split('.').pop();
            const path = `${ticketId}/${Date.now()}_${i}.${ext}`;
            const { data, error } = await supabaseClient.storage
                .from('ticket-attachments')
                .upload(path, file);
            if (error) throw error;
            // Get public URL
            const { data: { publicUrl } } = supabaseClient.storage
                .from('ticket-attachments')
                .getPublicUrl(path);
            uploaded.push(publicUrl);
        }
        return uploaded;
    },

    // Load and display tickets on success page
    displaySuccessTicket() {
        const ticket = JSON.parse(storageUtil.getItem('rcl_lastTicket'));
        console.log('Displaying success ticket:', ticket);
        if (ticket) {
            document.getElementById('summaryCategory').textContent = ticket.category;
            document.getElementById('summaryUrgency').textContent = this.getUrgencyLevel(ticket.urgency);
            document.getElementById('summaryId').textContent = ticket.id;
            document.getElementById('summaryDate').textContent = ticket.dateSubmitted ? new Date(ticket.dateSubmitted).toLocaleString() : '—';
            const container = document.getElementById('attachmentsContainer');
                if (container && ticket.attachments && ticket.attachments.length) {
                    container.innerHTML = ''; // clear any existing content
                    // Add a heading
                    const heading = document.createElement('h3');
                    heading.className = 'text-lg font-bold text-gray-800 mb-3 mt-4';
                    heading.textContent = '📎 Attached Proofs';
                    container.appendChild(heading);

                    const grid = document.createElement('div');
                    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';

                    ticket.attachments.forEach(url => {
                        // Extract file name from URL (last part after '/')
                        const fileName = decodeURIComponent(url.split('/').pop()) || 'attachment';
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
                        
                        const card = document.createElement('a');
                        card.href = url;
                        card.target = '_blank';
                        card.className = 'flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 group cursor-pointer';
                        
                        // Icon
                        const iconSpan = document.createElement('span');
                        iconSpan.className = 'material-symbols-outlined text-2xl text-primary-container';
                        iconSpan.textContent = isImage ? 'image' : 'description';
                        
                        // File info
                        const infoDiv = document.createElement('div');
                        infoDiv.className = 'flex-1 min-w-0';
                        const nameSpan = document.createElement('p');
                        nameSpan.className = 'text-sm font-medium text-gray-800 truncate';
                        nameSpan.textContent = fileName;
                        const actionSpan = document.createElement('p');
                        actionSpan.className = 'text-xs text-primary group-hover:underline';
                        actionSpan.textContent = 'Click to view';
                        infoDiv.appendChild(nameSpan);
                        infoDiv.appendChild(actionSpan);
                        
                        card.appendChild(iconSpan);
                        card.appendChild(infoDiv);
                        grid.appendChild(card);
                    });
                    
                    container.appendChild(grid);
                } else if (container) {
                    container.innerHTML = '<p class="text-sm text-gray-500 mt-2">No attachments uploaded.</p>';
                }
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
    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('admin_id').value.trim();
        const password = document.getElementById('password').value;
        // const rememberMe = document.getElementById('remember').checked;

        // Basic validation
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (error) throw error;

            if (data.session) {
                this.isLoggedIn = true;
                // Supabase automatically stores the session in localStorage (key: 'sb-...')
                // The session expiry is controlled by Supabase (default 1 hour, can be extended in dashboard)
                // For "Remember me" we can optionally increase the session expiry via Supabase settings
                // (Go to Authentication -> Settings -> JWT expiry time – e.g., 8 hours)
                this.navigate('admin-dashboard');
            }
        } catch (err) {
            console.error('Login error:', err.message);
            alert('Invalid credentials. Please check your email and password.');
        }
    },
    
    // Check login status
    async checkLoginStatus() {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) {
            console.error('Session check error:', error.message);
            this.isLoggedIn = false;
        } else {
            this.isLoggedIn = !!session;   // true if session exists
        }

        // Redirect if trying to access protected pages without login
        const protectedPages = ['admin-dashboard', 'ticket-details'];
        const currentPage = this.getCurrentPageFromPath(); // define helper
        if (!this.isLoggedIn && protectedPages.includes(currentPage)) {
            this.navigate('login');
        }
    },
    // Helper to get page name from window.location
    getCurrentPageFromPath() {
        const path = window.location.pathname;
        if (path.includes('admin/dashboard')) return 'admin-dashboard';
        if (path.includes('ticket-details')) return 'ticket-details';
        if (path.includes('login')) return 'login';
        if (path.includes('report-issue')) return 'report';
        if (path.includes('success')) return 'success';
        return 'home';
    },
    
    // Logout
    async logout() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) console.error('Logout error:', error.message);
        this.isLoggedIn = false;
        this.navigate('home');
    },

    // // Save a ticket to localStorage
    // saveTicket(ticket) {
    //     let tickets = JSON.parse(storageUtil.getItem('rcl_tickets')) || [];
    //     tickets.push(ticket);
    //     storageUtil.setItem('rcl_tickets', JSON.stringify(tickets));
    // },

    // // Load tickets for admin dashboard
    // async loadTickets() {
    //     if (window.location.pathname.includes('admin/dashboard')) {
    //         this.displayAdminDashboard();
    //     }
        
    //     if (window.location.pathname.includes('ticket-details')) {
    //         // Ticket details will be loaded by the page's own DOMContentLoaded event
    //     }
        
    //     if (window.location.pathname.includes('success')) {
    //         this.displaySuccessTicket();
    //     }
    // },
    
    // // Display admin dashboard
    // displayAdminDashboard() {
    //     const tickets = JSON.parse(storageUtil.getItem('rcl_tickets')) || [];
        
    //     // Update stats
    //     document.getElementById('totalTickets').textContent = tickets.length;
        
    //     const open = tickets.filter(t => t.status === 'Open').length;
    //     const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    //     const resolved = tickets.filter(t => t.status === 'Resolved').length;
        
    //     document.getElementById('openTickets').textContent = open;
    //     document.getElementById('inProgressTickets').textContent = inProgress;
    //     document.getElementById('resolvedTickets').textContent = resolved;
        
    //     // Use the modular renderTickets function
    //     this.renderTickets();
    // },

    displayAdminDashboard() {
        // Show stats (you can still compute from Supabase, but for now just call loadTickets)
        this.loadTickets();  // this will fetch and render the table

        // Optional: also fetch stats from Supabase if you want accurate counts
        // For simplicity, you can later add a separate method to update stats.
        // For now, keep your old stats update or remove it.
    },

    // Update the summary cards with ticket counts
    updateStats(tickets) {
        const total = tickets.length;
        const open = tickets.filter(t => t.status === 'Open').length;
        const inProgress = tickets.filter(t => t.status === 'In Progress').length;
        const resolved = tickets.filter(t => t.status === 'Resolved').length;

        document.getElementById('totalTickets').textContent = total;
        document.getElementById('openTickets').textContent = open;
        document.getElementById('inProgressTickets').textContent = inProgress;
        document.getElementById('resolvedTickets').textContent = resolved;
    },

    // Make sure supabase client is already initialized
    // Load tickets from Supabase and render table
    async loadTickets() {
        const tableBody = document.getElementById('ticketTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">Loading tickets...</td></tr>';

        try {
            const { data: tickets, error } = await supabaseClient
                .from('tickets')
                .select('*')
                .order('date_submitted', { ascending: false });

            if (error) throw error;
            this.updateStats(tickets || []);
            this.renderTickets(tickets || []);
        } catch (err) {
            console.error('Failed to load tickets:', err);
            tableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-red-500">Error loading tickets. Please refresh.</td></tr>';
        }
    },

    renderTickets(tickets) {
        const tableBody = document.getElementById('ticketTableBody');
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (!tickets || tickets.length === 0) {
            tableBody.innerHTML = '<tr class="hover:bg-gray-50 transition-colors"><td colspan="7" class="px-6 py-8 text-center text-gray-500">No tickets yet. Submitted issues will appear here.</td></tr>';
            return;
        }

        const getUrgencyLevel = (urgency) => {
            const levels = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Urgent', 5: 'Critical' };
            return levels[urgency] || 'Unknown';
        };

        tickets.forEach(ticket => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors';

            const statusColor = {
                'Open': 'bg-red-50 text-red-700 border-red-200',
                'In Progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
                'Resolved': 'bg-green-50 text-green-700 border-green-200'
            };
            const urgencyColor = {
                1: 'bg-green-50 text-green-700',
                2: 'bg-yellow-50 text-yellow-700',
                3: 'bg-orange-50 text-orange-700',
                4: 'bg-red-50 text-red-700',
                5: 'bg-red-100 text-red-900'
            };

            // ID cell
            const idCell = document.createElement('td');
            idCell.className = 'px-6 py-4';
            const idLink = document.createElement('a');
            idLink.className = 'text-primary font-bold hover:underline cursor-pointer';
            idLink.onclick = () => app.navigate('ticket-details', ticket.ticket_id);
            idLink.textContent = ticket.ticket_id;
            idCell.appendChild(idLink);

            // Date cell
            const dateCell = document.createElement('td');
            dateCell.className = 'px-6 py-4 text-gray-600 text-body-md';
            dateCell.textContent = ticket.date_submitted ? new Date(ticket.date_submitted).toLocaleString() : '—';

            // Category cell
            const categoryCell = document.createElement('td');
            categoryCell.className = 'px-6 py-4';
            const categorySpan = document.createElement('span');
            categorySpan.className = 'px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded';
            categorySpan.textContent = ticket.category;
            categoryCell.appendChild(categorySpan);

            // Company cell
            const companyCell = document.createElement('td');
            companyCell.className = 'px-6 py-4 text-sm';
            companyCell.textContent = ticket.company || '—';

            // Urgency cell
            const urgencyCell = document.createElement('td');
            urgencyCell.className = 'px-6 py-4';
            const urgencySpan = document.createElement('span');
            urgencySpan.className = `px-2 py-1 ${urgencyColor[ticket.urgency] || 'bg-gray-50'} text-xs font-bold rounded`;
            urgencySpan.textContent = getUrgencyLevel(ticket.urgency);
            urgencyCell.appendChild(urgencySpan);

            // Status dropdown
            const statusCell = document.createElement('td');
            statusCell.className = 'px-6 py-4';
            const statusSelect = document.createElement('select');
            const statusColorClass = statusColor[ticket.status] || 'bg-gray-50 text-gray-700';
            statusSelect.className = `appearance-none w-full border ${statusColorClass} py-1.5 px-3 pr-8 rounded text-xs font-bold focus:outline-none cursor-pointer`;
            statusSelect.onchange = async (e) => {
                const newStatus = e.target.value;
                await this.updateTicketStatus(ticket.id, newStatus);
                statusSelect.className = `appearance-none w-full border ${statusColor[newStatus] || 'bg-gray-50 text-gray-700'} py-1.5 px-3 pr-8 rounded text-xs font-bold focus:outline-none cursor-pointer`;
            };

            ['Open', 'In Progress', 'Resolved'].forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status.toUpperCase();
                option.selected = ticket.status === status;
                statusSelect.appendChild(option);
            });
            statusCell.appendChild(statusSelect);

            // Delete button
            const actionCell = document.createElement('td');
            actionCell.className = 'px-6 py-4';
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded hover:bg-red-100 transition-colors';
            deleteBtn.textContent = 'DELETE';
            deleteBtn.onclick = async () => {
                const success = await this.deleteTicket(ticket.id,ticket.ticket_id);
                if (success) {
                    row.remove();
                    if (tableBody.children.length === 0) {
                        this.renderTickets([]);
                        this.updateStats([]);
                    }
                }
            };
            actionCell.appendChild(deleteBtn);

            row.append(idCell, dateCell, categoryCell, companyCell, urgencyCell, statusCell, actionCell);
            tableBody.appendChild(row);
        });
    },

    async updateTicketStatus(ticketId, newStatus) {
        const { error } = await supabaseClient
            .from('tickets')
            .update({ status: newStatus })
            .eq('id', ticketId);
        if (error) {
            console.error('Status update failed:', error);
            alert('Could not update status. Please try again.');
        }
    },

    async deleteTicket(ticketId, ticket_id) {
        const confirmed = confirm(`Are you sure you want to delete ticket ${ticket_id}? This action cannot be undone.`);
        if (!confirmed) return false;

        const { error } = await supabaseClient
            .from('tickets')
            .delete()
            .eq('id', ticketId);   // make sure 'id' is the primary key column name

        if (error) {
            console.error('Deletion failed:', error);
            alert('Could not delete ticket. Please try again.');
            return false;
        }
        return true;
    },
    // Display ticket details page
    // displayTicketDetails() {
    //     const ticketId = storageUtil.getItem('currentTicketId');
    //     const tickets = JSON.parse(storageUtil.getItem('rcl_tickets')) || [];
    //     const ticket = tickets.find(t => t.id === ticketId);

    //     if (!ticket) {
    //         alert('Ticket not found!');
    //         this.navigate('admin-dashboard');
    //         return;
    //     }

    //     // Set status color
    //     const statusColorMap = {
    //         'Open': 'bg-red-50 text-red-700',
    //         'In Progress': 'bg-yellow-50 text-yellow-700',
    //         'Resolved': 'bg-green-50 text-green-700'
    //     };

    //     const urgencyColorMap = {
    //         1: 'bg-green-50 text-green-700',
    //         2: 'bg-yellow-50 text-yellow-700',
    //         3: 'bg-orange-50 text-orange-700',
    //         4: 'bg-red-50 text-red-700',
    //         5: 'bg-red-100 text-red-900'
    //     };

    //     // Populate ticket information safely
    //     document.getElementById('ticketId').textContent = ticket.id;
    //     document.getElementById('ticketIdInfo').textContent = ticket.id;
    //     document.getElementById('submittedOn').textContent = ticket.dateSubmitted;
        
    //     const statusEl = document.getElementById('ticketStatus');
    //     statusEl.textContent = ticket.status;
    //     statusEl.className = `px-3 py-1.5 rounded text-sm font-bold ${statusColorMap[ticket.status] || 'bg-gray-50 text-gray-700'}`;

    //     const urgencyEl = document.getElementById('ticketUrgency');
    //     urgencyEl.textContent = this.getUrgencyLevel(ticket.urgency);
    //     urgencyEl.className = `px-3 py-1.5 rounded text-sm font-bold ${urgencyColorMap[ticket.urgency] || 'bg-gray-50 text-gray-700'}`;

    //     // Submitted By - use textContent to prevent XSS
    //     document.getElementById('fullName').textContent = ticket.fullName;
    //     document.getElementById('email').textContent = ticket.email;
    //     document.getElementById('phone').textContent = ticket.phone;

    //     // Issue Details - use textContent to prevent XSS
    //     document.getElementById('category').textContent = ticket.category;
    //     document.getElementById('company').textContent = ticket.company;
    //     document.getElementById('location').textContent = ticket.location;
    //     document.getElementById('specificLocation').textContent = ticket.specificLocation;
    //     document.getElementById('description').textContent = ticket.description;

    //     // Set status dropdown
    //     document.getElementById('statusSelect').value = ticket.status;
    // },
    async displayTicketDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const ticketId = urlParams.get('ticketId');
        if (!ticketId) {
            alert('No ticket ID provided.');
            this.navigate('admin-dashboard');
            return;
        }

        try {
            const { data: ticket, error } = await supabaseClient
                .from('tickets')
                .select('*')
                .eq('ticket_id', ticketId)
                .single();

            if (error) throw error;
            if (!ticket) {
                alert('Ticket not found');
                this.navigate('admin-dashboard');
                return;
            }

            // Store internal id for status updates
            storageUtil.setItem('currentTicketInternalId', ticket.id);

            // Populate all text fields (same as before)
            this._populateTicketFields(ticket);

            // --- Render attachments prettily ---
            this._renderAttachments(ticket.attachments);

        } catch (err) {
            console.error('Failed to load ticket details:', err);
            alert('Error loading ticket details. Please try again.');
            this.navigate('admin-dashboard');
        }
    },

    // Helper: populate basic ticket info (keeps main method clean)
    _populateTicketFields(ticket) {
        const statusColorMap = {
            'Open': 'bg-red-50 text-red-700',
            'In Progress': 'bg-yellow-50 text-yellow-700',
            'Resolved': 'bg-green-50 text-green-700'
        };
        const urgencyColorMap = {
            1: 'bg-green-50 text-green-700',
            2: 'bg-yellow-50 text-yellow-700',
            3: 'bg-orange-50 text-orange-700',
            4: 'bg-red-50 text-red-700',
            5: 'bg-red-100 text-red-900'
        };

        document.getElementById('ticketId').textContent = `Ticket ${ticket.ticket_id}`;
        document.getElementById('ticketIdInfo').textContent = ticket.ticket_id;
        document.getElementById('submittedOn').textContent = new Date(ticket.date_submitted).toLocaleString();

        const statusEl = document.getElementById('ticketStatus');
        statusEl.textContent = ticket.status;
        statusEl.className = `px-3 py-1.5 rounded text-sm font-bold ${statusColorMap[ticket.status] || 'bg-gray-50 text-gray-700'}`;

        const urgencyEl = document.getElementById('ticketUrgency');
        urgencyEl.textContent = this.getUrgencyLevel(ticket.urgency);
        urgencyEl.className = `px-3 py-1.5 rounded text-sm font-bold ${urgencyColorMap[ticket.urgency] || 'bg-gray-50 text-gray-700'}`;

        document.getElementById('fullName').textContent = ticket.full_name;
        document.getElementById('email').textContent = ticket.email || '—';
        document.getElementById('phone').textContent = ticket.phone;
        document.getElementById('category').textContent = ticket.category;
        document.getElementById('company').textContent = ticket.company || '—';
        document.getElementById('location').textContent = ticket.location;
        document.getElementById('specificLocation').textContent = ticket.specific_location || '—';
        document.getElementById('description').textContent = ticket.description;

        document.getElementById('statusSelect').value = ticket.status;
    },

    // Helper: render pretty attachment grid
    _renderAttachments(attachments) {
        const container = document.getElementById('attachmentsContainer');
        if (!container) return;

        // Clear any existing content
        container.innerHTML = '';

        if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-sm">No attachments uploaded.</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';

        attachments.forEach(url => {
            // Extract file name from URL (last part after '/')
            let fileName = decodeURIComponent(url.split('/').pop()) || 'attachment';
            // Limit length for display
            if (fileName.length > 40) fileName = fileName.substring(0, 37) + '...';
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

            const card = document.createElement('a');
            card.href = url;
            card.target = '_blank';
            card.className = 'flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 group cursor-pointer';

            // Icon
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined text-2xl text-primary-container';
            iconSpan.textContent = isImage ? 'image' : 'description';

            // Info div
            const infoDiv = document.createElement('div');
            infoDiv.className = 'flex-1 min-w-0';
            const nameSpan = document.createElement('p');
            nameSpan.className = 'text-sm font-medium text-gray-800 truncate';
            nameSpan.textContent = fileName;
            const actionSpan = document.createElement('p');
            actionSpan.className = 'text-xs text-primary group-hover:underline';
            actionSpan.textContent = 'Click to view';
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(actionSpan);

            card.appendChild(iconSpan);
            card.appendChild(infoDiv);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    },

    // Update ticket status from details page
    async updateTicketStatusFromDetails() {
        const internalId = storageUtil.getItem('currentTicketInternalId');
        if (!internalId) {
            alert('Error: No ticket selected. Please refresh the page.');
            return;
        }
        const newStatus = document.getElementById('statusSelect').value;

        const { error } = await supabaseClient
            .from('tickets')
            .update({ status: newStatus })
            .eq('id', internalId);

        if (error) {
            console.error('Status update failed:', error);
            alert('Could not update status. Please try again.');
        } else {
            alert('Status updated successfully!');
            // Refresh the displayed data (re-fetch and re-render)
            this.displayTicketDetails();
        }
    }
    

};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
