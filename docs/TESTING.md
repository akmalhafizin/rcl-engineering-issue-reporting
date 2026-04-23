# Testing Checklist

## 🧪 Pre-Launch Testing

Use this checklist to verify all features work correctly before deployment.

---

## 1. 📱 Responsive Design Tests

- [ ] Desktop (1920x1080) - All elements visible
- [ ] Tablet (768x1024) - Responsive layout active
- [ ] Mobile (375x667) - Touch-friendly interface
- [ ] Navigation works on all sizes
- [ ] Forms display correctly
- [ ] Images scale properly

**Tools**: DevTools (F12) → Device Emulation

---

## 2. 🏠 Home Page Tests

### Layout
- [ ] Logo visible and clickable
- [ ] Navigation menu appears
- [ ] Hero section displays
- [ ] CTA button visible
- [ ] Footer visible
- [ ] No overlapping elements

### Functionality
- [ ] Logo links to home
- [ ] "Report Issue" button works
- [ ] "Admin" button works
- [ ] Footer links functional
- [ ] Smooth scrolling

---

## 3. 📝 Report Issue Form Tests

### Form Display
- [ ] All input fields visible
- [ ] Labels correct
- [ ] Placeholders helpful
- [ ] Form sections organized
- [ ] Buttons visible

### Field Validation
- [ ] Full Name: Required field
- [ ] Phone: Required field
- [ ] Company: Required field
- [ ] Category: Dropdown works
- [ ] Description: Textarea works
- [ ] Urgency: Slider works

### Urgency Slider
- [ ] Slider responds to drag
- [ ] Values 1-5 work
- [ ] Label updates correctly
- [ ] Color changes with value

### Form Submission
- [ ] Submit button enabled when form complete
- [ ] Validation messages appear for empty fields
- [ ] Form clears after successful submission
- [ ] Redirects to success page

---

## 4. ✅ Success Page Tests

### Content Display
- [ ] Success icon visible
- [ ] Success message appears
- [ ] Ticket details populate
- [ ] Ticket ID displays
- [ ] Date/time correct
- [ ] Category shows

### Functionality
- [ ] "Submit Another Issue" button works
- [ ] "Go to Home" button works
- [ ] Support link navigates correctly

### Data
- [ ] Ticket info matches submitted form
- [ ] Unique ticket IDs generate
- [ ] Timestamps correct

---

## 5. 🔐 Admin Login Tests

### Login Page
- [ ] Form displays correctly
- [ ] Username field works
- [ ] Password field masks input
- [ ] "Forgot Password" link present
- [ ] Remember me checkbox works

### Login Validation
- [ ] Accepts: `admin@rcl.com` / `password123`
- [ ] Rejects wrong username
- [ ] Rejects wrong password
- [ ] Shows error message for failures
- [ ] Clears sensitive data on error

### After Login
- [ ] Redirects to dashboard
- [ ] Session persists on refresh
- [ ] Logout button works
- [ ] Demo credentials text appears

---

## 6. 📊 Admin Dashboard Tests

### Dashboard Load
- [ ] Dashboard displays correctly
- [ ] Sidebar navigation visible
- [ ] Top bar shows "Ticket Console"
- [ ] No console errors

### Statistics Cards
- [ ] Total Tickets count correct
- [ ] Pending Tickets count correct
- [ ] In Progress count correct
- [ ] Completed count correct
- [ ] Numbers update after new submission

### Ticket Table
- [ ] Table displays all submitted tickets
- [ ] Columns: ID, Date, Category, Company, Urgency, Status
- [ ] Rows display correctly
- [ ] Data matches original submission
- [ ] Status dropdown appears

### Status Updates
- [ ] Can change from Pending to In-Progress
- [ ] Can change from In-Progress to Completed
- [ ] Can change back to Pending
- [ ] Changes persist on page refresh
- [ ] Color coding updates properly

### Empty State
- [ ] Shows message when no tickets
- [ ] Handles gracefully

---

## 7. 💾 Data Persistence Tests

### LocalStorage Saving
- [ ] Data saves after form submission
- [ ] Data persists on page refresh (F5)
- [ ] Data survives browser close/reopen
- [ ] Data accessible from DevTools

### Data Integrity
- [ ] All form fields saved
- [ ] Ticket ID consistently matches
- [ ] Dates/times preserved
- [ ] Status changes saved

### Data Export
```javascript
// In browser console:
JSON.parse(localStorage.getItem('rcl_tickets'))
// Should show all tickets as JSON
```

---

## 8. 🔀 Navigation Tests

### Internal Navigation
- [ ] Home → Report Issue works
- [ ] Report Issue → Home works
- [ ] Home → Admin works
- [ ] Admin → Home works
- [ ] Admin → Dashboard after login
- [ ] Dashboard → Logout works
- [ ] All links have no 404 errors

### External Links
- [ ] Footer links navigate (if enabled)
- [ ] Social links work (if enabled)

---

## 9. 🖥️ Browser Compatibility

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Responsive display

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Responsive display

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Responsive display

### Edge
- [ ] All features work
- [ ] No console errors
- [ ] Responsive display

---

## 10. 📦 File Tests

### File Integrity
- [ ] All HTML files present
- [ ] app.js loads correctly
- [ ] No 404 errors for resources
- [ ] Google Fonts load
- [ ] Material Icons load

### Asset Loading
- [ ] Images display (if any)
- [ ] Icons render properly
- [ ] CSS applies correctly
- [ ] JavaScript executes

---

## 11. ⚡ Performance Tests

### Load Time
- [ ] Home page: < 2 seconds
- [ ] Admin dashboard: < 1 second
- [ ] Form page: < 1 second
- [ ] Success page: < 1 second

### Memory Usage
- [ ] No memory leaks
- [ ] Smooth scrolling
- [ ] No lag on interactions
- [ ] Table renders smoothly with many tickets

---

## 12. 🔒 Security Tests

### Input Validation
- [ ] Form rejects empty required fields
- [ ] Phone format validation (if configured)
- [ ] Email format validation
- [ ] No vulnerability to XSS

### Session Security
- [ ] Login credentials not visible in URL
- [ ] Logout clears session
- [ ] Cannot access dashboard without login
- [ ] Page refresh maintains session

### Data Protection
- [ ] Sensitive data not logged
- [ ] No exposures in console
- [ ] localStorage only on trusted domain

---

## 13. ♿ Accessibility Tests

### Keyboard Navigation
- [ ] Tab through form fields in order
- [ ] Enter submits form
- [ ] Buttons accessible via keyboard
- [ ] No keyboard traps

### Screen Reader
- [ ] Form labels accessible
- [ ] Buttons have descriptive text
- [ ] Icons have alt text
- [ ] Table headers proper

### Color Contrast
- [ ] Text readable on backgrounds
- [ ] Links distinguished from text
- [ ] Focus states visible

---

## 14. 📱 Mobile-Specific Tests

### Touch Interactions
- [ ] Form fields touchable
- [ ] Buttons easy to tap
- [ ] Slider works with touch
- [ ] No accidental double-taps

### Mobile Features
- [ ] Viewport meta tag correct
- [ ] No horizontal scroll on mobile
- [ ] Font sizes readable
- [ ] Touch keyboard appropriate

### Mobile Browsers
- [ ] Chrome Mobile works
- [ ] Safari iOS works
- [ ] Firefox Mobile works
- [ ] Samsung Browser works

---

## 15. 🐛 Error Handling

### Console
- [ ] No JavaScript errors
- [ ] No CSS warnings
- [ ] No security warnings
- [ ] All warnings expected

### Failed Scenarios
- [ ] Form submit with empty fields shows error
- [ ] Login fails with wrong credentials
- [ ] Page gracefully handles if localStorage disabled
- [ ] Missing files handled properly

---

## Test Scenario: Complete Workflow

Execute this full workflow to verify everything:

1. **Clear Data**
   - [ ] Open DevTools → Application → LocalStorage
   - [ ] Delete all rcl entries
   - [ ] Refresh page

2. **Submit Issue**
   - [ ] Open `index.html`
   - [ ] Click "Report an Issue"
   - [ ] Fill all fields:
     - Name: "Test User"
     - Phone: "+60 12-345 6789"
     - Company: "Test Company"
     - Location: "Test Location"
     - Category: "Mechanical Failure"
     - Specific Location: "Block A, Level 1"
     - Description: "Test issue"
     - Urgency: 4 (High)
   - [ ] Click "SUBMIT ISSUE"
   - [ ] Verify success page shows correct data

3. **Admin Check**
   - [ ] Go to Admin
   - [ ] Login with `admin@rcl.com` / `password123`
   - [ ] Verify dashboard shows:
     - Total Tickets: 1
     - Pending: 1
   - [ ] Find ticket in table
   - [ ] Verify all submitted data present

4. **Update Status**
   - [ ] Click status dropdown
   - [ ] Change to "In-Progress"
   - [ ] Verify color changes
   - [ ] Refresh page
   - [ ] Verify status persisted

5. **Submit Second Issue**
   - [ ] Logout
   - [ ] Go to Report Issue
   - [ ] Submit different issue with different category
   - [ ] Check admin dashboard shows 2 tickets

---

## 🎯 Sign-Off

### Pre-Launch Checklist

- [ ] All tests passed
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Browsers compatible
- [ ] Accessibility verified
- [ ] Security reviewed
- [ ] Team approved

### Ready for Deployment?

- [ ] ✅ Yes, proceed to deployment
- [ ] ❌ No, reference failed tests above

---

## 📊 Test Results

| Test Category | Tests | Passed | Failed | Notes |
|---------------|-------|--------|--------|-------|
| Responsive    | 6     | __ / 6 | __     |       |
| Home Page     | 7     | __ / 7 | __     |       |
| Report Form   | 13    | __/13  | __     |       |
| Success Page  | 8     | __ / 8 | __     |       |
| Admin Login   | 9     | __ / 9 | __     |       |
| Dashboard     | 11    | __/11  | __     |       |
| Data          | 7     | __ / 7 | __     |       |
| Navigation    | 8     | __ / 8 | __     |       |
| Browser Comp. | 12    | __/12  | __     |       |
| Performance   | 8     | __ / 8 | __     |       |
| Security      | 6     | __ / 6 | __     |       |
| Accessibility | 9     | __ / 9 | __     |       |
| Mobile        | 8     | __ / 8 | __     |       |
| Error Handle  | 4     | __ / 4 | __     |       |
| **TOTAL**     | **126** | **__/126** | **__** | |

---

## Notes / Issues Found

```
1. ________________________
2. ________________________
3. ________________________
4. ________________________
5. ________________________
```

---

**Test Date**: _____/_____/_____
**Tested By**: ____________________
**Approved By**: ____________________

---

## Common Issues & Fixes

### Issue: localStorage is disabled
- Check privacy settings
- Try incognito mode
- Try different browser

### Issue: Form not submitting
- Check for JavaScript errors (F12)
- Verify all required fields filled
- Check if localStorage quota exceeded

### Issue: Admin dashboard empty
- Verify tickets submitted
- Check localStorage has data (F12)
- Try refreshing page

### Issue: Urgency slider not updating
- Check JavaScript console for errors
- Try different browser
- Verify range input element exists

---

**Happy Testing! 🎉**
