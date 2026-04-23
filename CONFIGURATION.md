# Configuration Setup

## Environment Variables

The application now uses a configuration file to manage sensitive credentials. Follow these steps to set up your environment:

### Step 1: Copy the Example Configuration

Copy the `.env.example` file to `assets/js/config.js`:

```bash
cp assets/js/config.js.example assets/js/config.js
```

Or on Windows:
```cmd
copy assets\js\config.js.example assets\js\config.js
```

### Step 2: Update Credentials

Edit `assets/js/config.js` and update the credentials:

```javascript
const config = {
    ADMIN_ID: 'your-admin-email@example.com',
    ADMIN_PASSWORD: 'your-secure-password'
};
```

### Step 3: Security

**Important**: The `assets/js/config.js` file is listed in `.gitignore` to prevent accidental commits of sensitive credentials. Never commit this file to version control.

## Using the App

Once `config.js` is set up with your credentials, the application will use those values for authentication on the admin login page.

### Default Credentials (for development)
- Admin ID: `admin@rcl.com`
- Password: `password123`

These can be changed in the `assets/js/config.js` file.
