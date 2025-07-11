# Firebase Security Rules Setup Guide

## The Problem
You're getting "Permission denied" because your Firebase Security Rules are blocking write operations. This is a security feature that prevents unauthorized access to your database.

## Solution Steps

### 1. Update Firebase Security Rules

#### Option A: Quick Fix (Less Secure - for development only)
Go to your Firebase Console → Firestore Database → Rules and temporarily use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Option B: Secure Fix (Recommended)
Use the `firestore.rules` file I created, but **IMPORTANT**: Replace `"your-admin-email@gmail.com"` with your actual admin email address.

### 2. Deploy Rules (if using Firebase CLI)

```bash
# Install Firebase CLI if you haven't
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 3. Manual Rules Update (Alternative)

If you prefer to update rules manually:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database → Rules
4. Copy the content from `firestore.rules` file
5. Replace `"your-admin-email@gmail.com"` with your email
6. Click "Publish"

Do the same for Storage → Rules with the content from `storage.rules`.

### 4. Verify Your Admin Email

Make sure you're logged in with the email address you added to the rules. Check in the browser console:

```javascript
// Open browser console and run:
firebase.auth().currentUser?.email
```

### 5. Test the Fix

1. Log out and log back into your admin panel
2. Try updating the resume URL again
3. Check the browser console for any remaining errors

## Alternative Quick Fix for Development

If you want to test immediately, you can temporarily use these permissive rules (NOT for production):

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: This allows anyone to read/write
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // WARNING: This allows anyone to read/write
    }
  }
}
```

## Important Notes

- Never use the permissive rules (`if true`) in production
- Always specify your actual admin email in the secure rules
- Test thoroughly after updating rules
- Monitor Firebase usage to ensure no unauthorized access

## Troubleshooting

If you still get permission errors:

1. Check that you're logged in with the correct admin email
2. Verify the email in Firebase rules matches exactly
3. Try logging out and back in
4. Check Firebase Console → Authentication to see if your user exists
5. Ensure your project ID is correct in the rules

## Need Help?

If you're still having issues, please share:
1. Your admin email address
2. Any console error messages
3. Your current Firebase rules (screenshot from console)
