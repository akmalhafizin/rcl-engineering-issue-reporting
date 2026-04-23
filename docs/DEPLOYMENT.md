# Deployment Guide

## Local Testing (Easiest)

### Option 1: Direct File Opening
1. Open `index.html` in any web browser
2. Start using the app immediately
3. No server required!

**Pros**: Instant, no setup
**Cons**: Some browsers restrict file:// URLs

### Option 2: Python Simple Server (Recommended)

#### Windows
```bash
# Open PowerShell in project folder
python -m http.server 8000

# Open browser to http://localhost:8000
```

#### Mac/Linux
```bash
# Open terminal in project folder
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

### Option 3: Node.js HTTP Server

```bash
# Install (if not already)
npm install -g http-server

# Run in project folder
http-server

# Open browser to http://localhost:8080
```

### Option 4: VS Code Live Server

1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Automatically opens in browser

---

## Production Deployment

### Deploy to GitHub Pages

1. Create GitHub repository
2. Push all files to main branch
3. Go to Settings → Pages
4. Select "main" as source
5. Save
6. Your app is live at: `https://yourusername.github.io/repo-name`

### Deploy to Netlify (Free)

1. Create Netlify account
2. Click "Add site" → "Deploy manually"
3. Drag and drop project folder
4. Done! It's live

### Deploy to Vercel (Free)

1. Create Vercel account
2. Click "Create new project"
3. Import from GitHub
4. Click "Deploy"
5. Your app is live

### Deploy to your own Server

#### Using Apache/Nginx

```bash
# Copy all files to web root
cp * /var/www/html/rcl-engineering/

# Make sure permissions are correct
chmod 755 /var/www/html/rcl-engineering/*

# Access via: http://your-domain.com/rcl-engineering/
```

#### Using Node.js Server

Create `server.js`:
```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url || 'index.html');
    
    if (!path.extname(filePath)) {
        filePath += '.html';
    }
    
    const fileType = path.extname(filePath);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json'
        }[fileType] || 'text/plain';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
```

Run with:
```bash
node server.js
```

---

## Environment Setup

### Prerequisites
- Any modern web browser
- Text editor (VS Code recommended)
- Optional: Python / Node.js for local server

### Installation
1. Download all files
2. Place in a folder
3. Open `index.html` in browser
4. Start using!

---

## Testing Checklist

- [ ] Home page loads
- [ ] Navigation works
- [ ] Report issue form appears
- [ ] Form validation works
- [ ] Submit stores data locally
- [ ] Success page displays ticket info
- [ ] Admin login accepts valid credentials
- [ ] Admin dashboard shows submitted tickets
- [ ] Ticket status updates work
- [ ] Statistics update correctly
- [ ] Mobile view is responsive

---

## Browser Testing

Test across these browsers:
- Chrome (Desktop)
- Firefox (Desktop)
- Safari (Desktop/Mobile)
- Edge (Desktop)
- Chrome Mobile (Android)
- Safari (iOS)

---

## Performance Optimization

### Current
- Page load: <1 second
- No API calls
- Minimal JavaScript
- Optimized CSS

### Future Optimizations
- Minify JavaScript
- Compress images
- Enable gzip compression
- Use CDN for library files
- Service Workers for offline support

---

## Backup & Migration

### Backup User Data
```javascript
// In browser console
const data = JSON.stringify(localStorage);
console.log(data);
// Save to file
```

### Restore Data
```javascript
// In browser console
localStorage.setItem('rcl_tickets', JSON.stringify(importedData));
location.reload();
```

### Export to CSV

```javascript
// In admin dashboard console
const tickets = JSON.parse(localStorage.getItem('rcl_tickets'));
const csv = "ID,Name,Phone,Company,Category,Status,Date\n";
const rows = tickets.map(t => 
    `"${t.id}","${t.fullName}","${t.phone}","${t.company}","${t.category}","${t.status}","${t.dateSubmitted}"`
).join('\n');
const data = csv + rows;
const link = document.createElement('a');
link.href = 'data:text/csv,' + encodeURIComponent(data);
link.download = 'rcl-tickets.csv';
link.click();
```

---

## SSL/HTTPS Setup

### Using Cloudflare (Free)

1. Go to cloudflare.com
2. Add your domain
3. Change nameservers
4. Enable SSL

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --webroot -w /var/www/html -d yourdomain.com

# Configure web server to use certificate
```

---

## Monitoring

### Simple Analytics
```javascript
// Log form submissions
console.log('Form submitted:', ticketData);

// Log logins
console.log('Admin Login:', adminId);

// Check stored data
console.log('Total tickets:', JSON.parse(localStorage.getItem('rcl_tickets')).length);
```

### Browser DevTools
- F12 → Console: Check for errors
- F12 → Application → Local Storage: View data
- F12 → Network: Check file loads

---

## Troubleshooting Deployment

### Issue: CORS Errors
**Solution**: Serve from proper HTTP server, not file://

### Issue: CSS Not Loading
**Solution**: Check file paths are relative

### Issue: JavaScript Not Working
**Solution**: Check console for errors (F12)

### Issue: Data Not Saving
**Solution**: localStorage might be disabled, check privacy settings

### Issue: Slow Loading
**Solution**: Clear browser cache, use HTTP/2

---

## Maintenance

### Regular Tasks
- [ ] Monitor error logs
- [ ] Backup user data monthly
- [ ] Update browser compatibility
- [ ] Review security

### Annual Maintenance
- [ ] Full security audit
- [ ] Update dependencies
- [ ] Performance optimization
- [ ] Backup review

---

## Scaling (Future)

When ready to scale:

1. **Add Backend**
   - Node.js/Express
   - Python/Flask
   - Java/Spring

2. **Add Database**
   - MongoDB
   - PostgreSQL
   - Firebase

3. **Add Authentication**
   - OAuth 2.0
   - JWT tokens
   - Two-factor auth

4. **Add APis**
   - REST API
   - GraphQL
   - WebSockets

---

## Support

For deployment issues:
1. Check browser console (F12)
2. Check file permissions
3. Verify file paths
4. Test with different browser
5. Check internet connection

---

## Quick Start Command

### All-in-One Setup
```bash
# Download repo
git clone <repo-url>
cd rcl-engineering-issue-reporting

# Start local server
python -m http.server 8000

# Open browser
# http://localhost:8000
```

---

## Deployment Checklist

- [ ] All files present
- [ ] index.html is main entry
- [ ] app.js loads correctly
- [ ] CSS files accessible
- [ ] Images/Icons load
- [ ] Forms work
- [ ] Admin login works
- [ ] Data persists on refresh
- [ ] Responsive on mobile
- [ ] No console errors

---

**Your app is ready to deploy!** 🚀
