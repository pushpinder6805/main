# Discourse Authentication Setup

This guide will help you configure Discourse as an authentication provider for the admin chat dashboard.

## Step 1: Enable DiscourseConnect Provider in Discourse

1. Log in to your Discourse forum as an admin: https://community.workspherepulse.com/admin
2. Go to **Settings** > **Login**
3. Search for "discourse connect provider"
4. Enable the setting: **enable discourse connect provider**
5. In the **discourse connect provider secrets** field, add a strong secret key (this is used to verify requests)
   - Example: `my-super-secret-key-12345` (use a strong random string)
   - Keep this secret safe - you'll need it in the next step

## Step 2: Configure Your Next.js App

1. Open your `.env` file in the project root
2. Update the `DISCOURSE_CONNECT_SECRET` value with the EXACT same secret you entered in Discourse:

```env
DISCOURSE_CONNECT_SECRET=my-super-secret-key-12345
```

3. Make sure this value matches EXACTLY what you entered in Discourse settings

## Step 3: Test the Authentication

1. Start your Next.js development server (if not already running)
2. Navigate to: http://localhost:3000/admin/chat
3. You should see a "Login with Discourse" button
4. Click it - you'll be redirected to your Discourse forum
5. Log in with your Discourse account
6. After successful login, you'll be redirected back to the admin chat dashboard

## Step 4: Verify Admin Access

For a user to access the admin chat dashboard, they must be either:
- An **admin** on the Discourse forum, OR
- A **moderator** on the Discourse forum

If a regular user (non-admin/non-moderator) tries to access `/admin/chat`, they will see an "Admin Permission Required" message.

## Troubleshooting

### "Invalid signature" error
- Make sure the `DISCOURSE_CONNECT_SECRET` in your `.env` file EXACTLY matches the secret in Discourse settings
- Restart your Next.js dev server after changing the `.env` file

### "Missing params" error
- This usually means DiscourseConnect Provider is not enabled in Discourse
- Double-check Step 1 above

### Not redirecting back after login
- Make sure your local dev server is running on the expected port
- Check that the callback URL is correctly formed

## How It Works

1. User clicks "Login with Discourse" on `/admin/chat`
2. They're redirected to your Discourse forum at `https://community.workspherepulse.com`
3. Discourse authenticates the user
4. Discourse sends the user data back to your app with a secure signature
5. Your app verifies the signature and checks if the user is an admin/moderator
6. If authorized, the user can access the admin chat dashboard

## Security Notes

- The `DISCOURSE_CONNECT_SECRET` should be kept private and never committed to version control
- Only admin and moderator users from Discourse can access the admin dashboard
- User sessions are stored in the browser's localStorage
- The authentication uses HMAC-SHA256 signatures to ensure data integrity
