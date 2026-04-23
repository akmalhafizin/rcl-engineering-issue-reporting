# API Integration Guide

## Current Implementation

The app currently uses **localStorage** (browser storage) for data persistence. This is perfect for:
- Local testing
- Demos
- Single-user scenarios

## Backend Integration Steps

### Step 1: Choose Backend Technology

#### Option A: Node.js + Express (Recommended for JavaScript developers)
```bash
npm init -y
npm install express cors body-parser
```

#### Option B: Python + Flask (Recommended for simplicity)
```bash
pip install flask flask-cors flask-sqlalchemy
```

#### Option C: Firebase (Easiest deployment)
- No server setup needed
- Hosted database
- Built-in authentication

### Step 2: Create API Endpoints

#### Using Node.js/Express

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Submit Issue
app.post('/api/tickets', (req, res) => {
    const ticket = {
        id: generateTicketId(),
        ...req.body,
        dateSubmitted: new Date().toLocaleString(),
        status: 'Pending'
    };
    
    // Save to database
    saveTicket(ticket);
    
    res.json({ success: true, ticket });
});

// Get All Tickets
app.get('/api/tickets', (req, res) => {
    const tickets = getAllTickets();
    res.json(tickets);
});

// Update Ticket Status
app.put('/api/tickets/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    updateTicket(id, { status });
    
    res.json({ success: true });
});

app.listen(3000, () => {
    console.log('API running on port 3000');
});
```

#### Using Python/Flask

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rcl.db'
db = SQLAlchemy(app)

class Ticket(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    fullName = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100))
    company = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    urgency = db.Column(db.Integer)
    status = db.Column(db.String(20), default='Pending')
    dateSubmitted = db.Column(db.DateTime, default=datetime.now)

@app.route('/api/tickets', methods=['POST'])
def submit_ticket():
    data = request.json
    ticket = Ticket(
        id=generate_ticket_id(),
        fullName=data['fullName'],
        phone=data['phone'],
        email=data.get('email'),
        company=data['company'],
        category=data['category'],
        description=data['description'],
        urgency=data['urgency']
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify({'success': True, 'ticketId': ticket.id})

@app.route('/api/tickets', methods=['GET'])
def get_tickets():
    tickets = Ticket.query.all()
    return jsonify([ticket.to_dict() for ticket in tickets])

@app.route('/api/tickets/<id>', methods=['PUT'])
def update_ticket(id):
    ticket = Ticket.query.get(id)
    ticket.status = request.json['status']
    db.session.commit()
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
```

### Step 3: Update Frontend JavaScript

Replace localStorage calls with API calls:

```javascript
// OLD: Using localStorage
const tickets = JSON.parse(localStorage.getItem('rcl_tickets')) || [];

// NEW: Using API
async function loadTickets() {
    const response = await fetch('http://localhost:3000/api/tickets');
    const tickets = await response.json();
    return tickets;
}
```

#### Update Form Submission

```javascript
async function handleIssueSubmit(formData) {
    try {
        const response = await fetch('http://localhost:3000/api/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Redirect to success page
            window.location.href = 'success.html';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting form');
    }
}
```

#### Update Admin Dashboard

```javascript
async function displayAdminDashboard() {
    try {
        const response = await fetch('http://localhost:3000/api/tickets');
        const tickets = await response.json();
        
        // Display tickets...
        renderTicketsTable(tickets);
        updateStats(tickets);
    } catch (error) {
        console.error('Error loading tickets:', error);
    }
}

async function updateTicketStatus(ticketId, newStatus) {
    try {
        const response = await fetch(`http://localhost:3000/api/tickets/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            displayAdminDashboard(); // Refresh
        }
    } catch (error) {
        console.error('Error updating ticket:', error);
    }
}
```

### Step 4: Add Authentication

#### Using JWT (JSON Web Tokens)

```javascript
// Login
async function handleLogin(email, password) {
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (result.token) {
        // Store token
        localStorage.setItem('auth_token', result.token);
        window.location.href = 'admin-dashboard.html';
    }
}

// Use token in requests
async function loadTickets() {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch('http://localhost:3000/api/tickets', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return response.json();
}
```

### Step 5: Add Email Notifications

#### Using Node.js + Nodemailer

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send confirmation email
app.post('/api/tickets', async (req, res) => {
    const ticket = createTicket(req.body);
    
    // Send email
    await transporter.sendMail({
        from: 'noreply@rcl.com',
        to: ticket.email,
        subject: `Ticket Submitted: ${ticket.id}`,
        html: `
            <h2>Issue Submitted Successfully</h2>
            <p>Your ticket ID: <strong>${ticket.id}</strong></p>
            <p>Category: ${ticket.category}</p>
            <p>Status: Pending</p>
        `
    });
    
    res.json({ success: true, ticket });
});
```

### Step 6: Database Schema

```sql
CREATE TABLE tickets (
    id VARCHAR(50) PRIMARY KEY,
    fullName VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    specificLocation VARCHAR(200),
    description TEXT NOT NULL,
    urgency INT,
    status VARCHAR(20) DEFAULT 'Pending',
    dateSubmitted DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'operator',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Step 7: Environment Variables

Create `.env` file:

```
DATABASE_URL=sqlite:///rcl.db
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@rcl.com
JWT_SECRET=your-secret-key
PORT=3000
```

### Step 8: CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:8000',
    credentials: true
}));
```

## Firebase Integration (Easiest)

### Setup Firebase

```bash
npm install firebase
```

### Authentication

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, getDocs } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login
async function handleLogin(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'admin-dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Submit ticket
async function submitTicket(formData) {
    try {
        await addDoc(collection(db, 'tickets'), {
            ...formData,
            dateSubmitted: new Date(),
            status: 'Pending'
        });
        window.location.href = 'success.html';
    } catch (error) {
        console.error('Error:', error);
    }
}

// Get all tickets
async function loadTickets() {
    const q = query(collection(db, 'tickets'));
    const querySnapshot = await getDocs(q);
    const tickets = [];
    querySnapshot.forEach((doc) => {
        tickets.push({ id: doc.id, ...doc.data() });
    });
    return tickets;
}
```

## API Testing

### Using Postman

1. Import API endpoints
2. Test GET, POST, PUT requests
3. Check response format

### Using cURL

```bash
# Test GET
curl http://localhost:3000/api/tickets

# Test POST
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John","phone":"+60 123","company":"ABC"}'

# Test PUT
curl -X PUT http://localhost:3000/api/tickets/RCL-123 \
  -H "Content-Type: application/json" \
  -d '{"status":"In-Progress"}'
```

## Migration Path

1. **Phase 1**: Keep localStorage for fallback
2. **Phase 2**: Add API backend
3. **Phase 3**: Migrate data to database
4. **Phase 4**: Deprecate localStorage
5. **Phase 5**: Remove localStorage

## Error Handling

```javascript
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        // Fallback to localStorage
        return getFallbackData();
    }
}
```

## Security Best Practices

- [ ] Use HTTPS only
- [ ] Validate all inputs
- [ ] Sanitize HTML/SQL injection
- [ ] Use CORS properly
- [ ] Implement rate limiting
- [ ] Add API authentication
- [ ] Log all activities
- [ ] Regular security audits

## Performance Tips

- Cache API responses
- Implement pagination
- Use compression
- Lazy load data
- Add request timeouts
- Monitor API response times

---

**Ready to add a backend? Start with Node.js + Express!** 🚀
