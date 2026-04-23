# RCL Engineering Issue Reporting App

A complete web application for managing facility and engineering issue reporting for RCL Engineering & Facilities Sdn Bhd.

## Features

### 1. **Public Portal**
- **Home Page** (`index.html`) - Landing page with company information and call-to-action
- **Report Issue Form** (`report-issue.html`) - Comprehensive form for submitting facility issues
- **Success Page** (`success.html`) - Confirmation with ticket details

### 2. **Admin Panel**
- **Admin Login** (`admin-login.html`) - Secure login portal
- **Admin Dashboard** (`admin-dashboard.html`) - Ticket management and analytics

### 3. **Features Include**
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Form validation
- ✅ Local storage for data persistence
- ✅ Real-time ticket status updates
- ✅ Unique ticket ID generation
- ✅ Dashboard analytics
- ✅ Beautiful Material Design UI

## File Structure

```
rcl-engineering-issue-reporting/
├── index.html              # Home page
├── report-issue.html       # Issue submission form
├── success.html            # Success confirmation page
├── admin-login.html        # Admin login page
├── admin-dashboard.html    # Admin dashboard
├── app.js                  # Main application logic
└── README.md               # This file
```

## Getting Started

### Installation

1. **Extract all files** to a web server or local directory
2. **Open in browser** - Simply open `index.html` in any modern web browser
3. **No backend required** - The app uses browser localStorage for data persistence

### Quick Start

1. Go to the home page (`index.html`)
2. Click "Report an Issue"
3. Fill out the issue submission form
4. Submit the form
5. View the success confirmation with your ticket ID

## User Guide

### Submitting an Issue

1. Navigate to the Report Issue page
2. Fill in your details:
   - **Full Name** (required)
   - **Phone Number** (required)
   - **Email** (optional)
   - **Company Name** (required)
   - **Location** (required)

3. Provide issue details:
   - **Category**: Select from predefined categories
   - **Specific Location**: Detailed location within facility
   - **Description**: Detailed description of the issue
   - **Urgency Level**: Drag slider from 1-5 (1=Low, 5=Critical)

4. Click "SUBMIT ISSUE"
5. Receive confirmation with ticket ID

### Admin Dashboard

#### Login
- **Email**: `admin@rcl.com`
- **Password**: `password123`

#### Dashboard Features
- **Overview Stats**: Total, Pending, In-Progress, and Completed tickets
- **Ticket Management**: View all submitted issues in a table
- **Status Updates**: Change ticket status (Pending → In-Progress → Completed)
- **Issue Details**: See all submitted information for each ticket

## Technical Details

### Technologies Used
- **HTML5** - Semantic structure
- **Tailwind CSS** - Responsive styling
- **JavaScript (ES6+)** - Application logic
- **Google Fonts** - Inter font
- **Material Design Icons** - UI icons

### Color Scheme
- **Primary**: #bb0004 (Red)
- **Secondary**: #555f6f (Dark Gray-Blue)
- **Tertiary**: #b5191a (Dark Red)
- **Background**: #f8f9fb (Light Gray)

### Data Storage

The app uses **browser localStorage** to persist data:

- `rcl_tickets` - Array of all submitted tickets
- `rcl_lastTicket` - Most recent ticket for success page
- `rcl_authed` - Admin authentication status
- `rcl_admin_name` - Admin name

### Ticket Structure

```json
{
  "id": "RCL-ABC1D-E2F34",
  "fullName": "John Doe",
  "phone": "+60 12-345 6789",
  "email": "john@company.com",
  "company": "ABC Corporation",
  "location": "Kuala Lumpur",
  "category": "Mechanical Failure",
  "specificLocation": "Block B, Level 4, Room 402",
  "description": "Issue description here...",
  "urgency": 3,
  "status": "Pending",
  "dateSubmitted": "Oct 24, 2024 • 14:32 MYT",
  "timestamp": 1729755120000
}
```

## Navigation

```
Home (index.html)
├── Report Issue (report-issue.html)
│   └── Success (success.html)
├── Admin Portal (admin-login.html)
│   └── Dashboard (admin-dashboard.html)
└── Footer Links
```

## Features Explained

### Issue Categories
- Mechanical Failure
- Electrical Malfunction
- Structural Damage
- HVAC Issues
- Other

### Urgency Levels
1. **Low** - Non-urgent general maintenance
2. **Low-Medium** - Minor issues, can wait
3. **Medium** - Standard maintenance priority
4. **High** - Equipment at risk, needs attention soon
5. **Critical** - Safety hazard, immediate action required

### Admin Functions
- View all submitted tickets
- Track ticket status in real-time
- Update ticket progress
- View submission analytics
- Filter by urgency level

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Changing Colors
Edit the Tailwind config in each HTML file's `<script id="tailwind-config">` section.

### Changing Issue Categories
Edit the `<select>` options in `report-issue.html`:
```html
<option value="Your Category">Your Category</option>
```

### Adding More Admin Features
Edit `app.js` and `admin-dashboard.html` to add new features.

## API Integrations (Future)

This app can be easily extended to connect with:
- Email service for ticket notifications
- Real database backend (Firebase, MongoDB, etc.)
- Ticketing system (Jira, ServiceNow, etc.)
- SMS notifications
- Photo upload services

## Security Notes

⚠️ **Important**: This is a demo application using localStorage. For production use:

1. Implement proper backend authentication
2. Move data to a secure database
3. Add SSL/TLS encryption
4. Implement user authentication
5. Add input validation and sanitization
6. Use environment variables for sensitive data
7. Implement rate limiting
8. Add CSRF protection

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rcl.com | password123 |

## Support & Troubleshooting

### Issue: Form not submitting
- Check browser console for errors
- Clear browser cache and cookies
- Ensure JavaScript is enabled

### Issue: Tickets not saving
- Check if localStorage is enabled
- Clear browser storage and try again
- Check browser developer tools (F12) → Application → Local Storage

### Issue: Admin login not working
- Use exact credentials: `admin@rcl.com` / `password123`
- Clear localStorage and try again
- Check if JavaScript is enabled

## Contact & Support

For technical support or issues:
- **Company**: RCL Engineering & Facilities Sdn Bhd
- **SSM**: 202501015082
- **Website**: Contact through the app's footer

## License

© 2026 RCL Engineering & Facilities Sdn Bhd. All rights reserved.

## Version History

- **v1.0** (2024-10-24)
  - Initial release
  - Issue reporting form
  - Admin dashboard
  - Ticket tracking
  - Real-time status updates

## Future Enhancements

- [ ] Backend API integration
- [ ] Email notifications
- [ ] Photo uploads
- [ ] Advanced filtering and search
- [ ] User accounts
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Automated escalations
- [ ] Multi-language support
- [ ] Dark mode

---

**Built with ❤️ by RCL Engineering & Facilities**
