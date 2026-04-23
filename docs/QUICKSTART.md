# Quick Start Guide - RCL Engineering Issue Reporting

## 🚀 Getting Started (30 seconds)

### Step 1: Open the App
Open `index.html` in your web browser. That's it! No installation needed.

### Step 2: Report an Issue
1. Click **"Report an Issue"** button
2. Fill in your details
3. Describe the problem
4. Set urgency level
5. Click **"SUBMIT ISSUE"**

### Step 3: Admin Access
1. Click **"Admin"** in navigation
2. Login with:
   - **Email**: `admin@rcl.com`
   - **Password**: `password123`
3. View and manage all tickets

---

## 📋 Form Fields Explained

### Personal Information
- **Full Name** - Your complete name
- **Phone** - Contact number (format: +60 12-345 6789)
- **Email** - Optional, for follow-up
- **Company** - Your organization name
- **Location** - City or general area

### Issue Details
- **Category** - Type of problem:
  - Mechanical Failure
  - Electrical Malfunction
  - Structural Damage
  - HVAC Issues
  - Other
- **Location** - Exact location (e.g., Block B, Level 4, Room 402)
- **Description** - Detailed explanation of the issue
- **Urgency** - Slide from 1 (Low) to 5 (Critical)

---

## 🔑 Admin Dashboard Features

### Dashboard Overview
```
┌─────────────────────────┐
│  Total Tickets: 15      │
│  Pending: 3             │
│  In Progress: 5         │
│  Completed: 7           │
└─────────────────────────┘
```

### Ticket Management
- View all submitted issues in a table
- Change status: Pending → In-Progress → Completed
- See all ticket details
- Filter by category or urgency

---

## 💾 Data Storage

All data is saved in your browser automatically. No server needed!

**Data saved includes:**
- Ticket ID (automatically generated)
- Submitter information
- Issue details
- Submission date & time
- Current status
- Urgency level

### Clear All Data (if needed)
1. Press **F12** to open Developer Tools
2. Go to **Application** tab
3. Click **Local Storage**
4. Right-click on your website → Delete
5. Refresh the page

---

## 🎨 Pages Overview

### 1. Home Page (`index.html`)
- Landing page with company info
- Quick access to report issues
- Navigation menu

### 2. Report Issue (`report-issue.html`)
- Complete issue submission form
- Form validation
- Real-time urgency indicator

### 3. Success Page (`success.html`)
- Confirmation message
- Ticket summary and ID
- Options to submit another or go home

### 4. Admin Login (`admin-login.html`)
- Secure login portal
- Demo credentials provided

### 5. Admin Dashboard (`admin-dashboard.html`)
- Ticket management interface
- Real-time statistics
- Status management

---

## ⚙️ Troubleshooting

### Q: How do I reset the app?
**A:** 
1. Press F12 → Application → Local Storage
2. Delete all entries
3. Refresh the page

### Q: Can I export the tickets?
**A:** 
1. Press F12 → Application → Local Storage
2. Click on any entry
3. Copy the JSON data

### Q: Will my data be saved if I clear browser history?
**A:** If you clear "cookies and site data", localStorage will be cleared too. Be careful!

### Q: Can I use this on mobile?
**A:** Yes! The app is fully responsive and works on all devices.

### Q: Can I customize the categories?
**A:** Yes, edit the `<select>` dropdown in `report-issue.html`

---

## 🔒 Security Info

This is a **demo/local app**. For production:
- Don't store sensitive data in browser
- Use backend database
- Implement proper authentication
- Add SSL certificates
- Regular security audits

---

## 📱 On Mobile

The app works perfectly on phones:
- Touch-friendly interface
- Responsive layout
- All features available
- Easy form input

Simply open the URL on your phone's browser!

---

## 💡 Tips & Tricks

1. **Save Offline**: All data stays on your device
2. **Quick ID Copy**: Ticket ID is clickable in admin panel
3. **Bulk Submit**: You can submit multiple issues easily
4. **Track Changes**: Watch status updates in real-time
5. **Urgency Guide**: Use 1-2 for scheduled maintenance, 4-5 for emergencies

---

## 🎯 Common Tasks

### Submit a New Issue
1. Click "Report an Issue"
2. Fill form completely
3. Click "SUBMIT ISSUE"
4. View confirmation page

### Check Ticket Status
1. Go to Admin Dashboard
2. Find your ticket by ID
3. View current status
4. See update timeline

### Update Ticket Status
1. Login to Admin
2. Find ticket in table
3. Click status dropdown
4. Select new status

### Get PDF of Ticket
1. Right-click on page
2. Select "Print"
3. Save as PDF

---

## 📞 Support

**Company**: RCL Engineering & Facilities Sdn Bhd
**SSM**: 202501015082

**For Technical Issues**:
- Check browser console (F12)
- Clear cache and cookies
- Try different browser
- Restart browser

---

## ✅ Checklist Before Submitting

- [ ] Full Name filled
- [ ] Phone number valid
- [ ] Company name entered
- [ ] Location selected
- [ ] Category chosen
- [ ] Issue described clearly
- [ ] Urgency level set appropriately

---

## 🚀 You're All Set!

Start reporting issues now. Your ticket will be tracked automatically.

Questions? Check the full documentation in `DOCUMENTATION.md`
