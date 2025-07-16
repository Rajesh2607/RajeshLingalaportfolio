# Firebase Console Setup Guide

## Overview
All Firebase configuration is now managed through the Firebase Console. No local rule files are needed.

## Setup Steps

### 1. Firebase Console Configuration

#### Firestore Database Rules
Go to Firebase Console → Firestore Database → Rules and use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all documents for public content
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to write
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
Go to Firebase Console → Storage → Rules and use:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow authenticated users to upload files
    match /{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Environment Variables Setup

Create a `.env` file in your project root with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Authentication Setup

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Email/Password authentication
3. Add your admin email to the Users tab

### 4. Storage Configuration

1. Go to Firebase Console → Storage
2. Click "Get started"
3. Choose your storage location
4. Apply the storage rules mentioned above

### 5. Testing

1. Deploy your application
2. Test image uploads in the admin panel
3. Check Firebase Console → Storage to verify uploads
4. Monitor Firebase Console → Authentication for user sessions

## Important Notes

- All configuration is managed through Firebase Console
- No local rule files needed
- Environment variables contain sensitive data - never commit `.env` to version control
- Rules are configured for development - adjust for production security needs

## Troubleshooting

### Images Not Uploading
1. Check Firebase Console → Storage rules are applied
2. Verify authentication is working
3. Check browser console for errors
4. Ensure storage bucket exists and is properly configured

### Permission Errors
1. Verify user is authenticated
2. Check storage rules allow authenticated writes
3. Ensure Firebase project ID is correct in environment variables

### Environment Variables Not Working
1. Restart development server after adding `.env`
2. Verify all required variables are set
3. Check variable names match exactly (including VITE_ prefix)

## Getting Firebase Config Values

1. Go to Firebase Console
2. Click Project Settings (gear icon)
3. Scroll down to "Your apps" section
4. Copy the config values to your `.env` file
