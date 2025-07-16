import { auth, storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Debug utility to test Firebase connectivity and permissions
export const debugFirebaseSetup = async () => {
  console.log('🔍 Firebase Debug Test Starting...');
  
  try {
    // Test 1: Check Firebase initialization
    console.log('✅ Test 1: Firebase Config');
    console.log('- Auth Domain:', auth.app.options.authDomain);
    console.log('- Project ID:', auth.app.options.projectId);
    console.log('- Storage Bucket:', storage.app.options.storageBucket);
    
    // Test 2: Check authentication
    console.log('\n✅ Test 2: Authentication');
    const user = auth.currentUser;
    if (user) {
      console.log('- User authenticated:', user.email);
      console.log('- User ID:', user.uid);
      console.log('- Email verified:', user.emailVerified);
    } else {
      console.log('❌ No user authenticated');
      return { success: false, error: 'User not authenticated' };
    }
    
    // Test 3: Check storage access
    console.log('\n✅ Test 3: Storage Access');
    try {
      // Create a test file
      const testData = new Blob(['Firebase storage test'], { type: 'text/plain' });
      const testRef = ref(storage, `debug/test-${Date.now()}.txt`);
      
      console.log('- Testing upload to:', testRef.fullPath);
      await uploadBytes(testRef, testData);
      
      const downloadUrl = await getDownloadURL(testRef);
      console.log('- Upload successful!');
      console.log('- Download URL:', downloadUrl);
      
      return { 
        success: true, 
        message: 'All tests passed! Storage is working correctly.',
        downloadUrl 
      };
      
    } catch (storageError) {
      console.error('❌ Storage test failed:', storageError);
      console.error('- Error code:', storageError.code);
      console.error('- Error message:', storageError.message);
      
      return { 
        success: false, 
        error: storageError.message,
        code: storageError.code 
      };
    }
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
    return { success: false, error: error.message };
  }
};

// Quick storage permission test
export const testStoragePermissions = async () => {
  if (!auth.currentUser) {
    return { success: false, error: 'User not authenticated' };
  }
  
  try {
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testRef = ref(storage, `test/${Date.now()}.txt`);
    await uploadBytes(testRef, testBlob);
    const url = await getDownloadURL(testRef);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: error.message, code: error.code };
  }
};

// Environment check
export const checkEnvironmentVars = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  console.log('🔍 Environment Variables Check:');
  requiredVars.forEach(varName => {
    const value = import.meta.env[varName];
    console.log(`- ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
  });
  
  return { 
    allPresent: missing.length === 0, 
    missing,
    count: requiredVars.length - missing.length 
  };
};