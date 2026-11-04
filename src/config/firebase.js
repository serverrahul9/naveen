// Firebase Configuration & Services for NAVEEN PRO EDITOR (Video Shooter & Video Editor)
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics';
import { getDatabase, ref as dbRef, set, get, onValue } from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

export const firebaseConfig = {
  apiKey: 'AIzaSyAtrWOhnTj9o6_6kYEwIpCw1KvMoKBiYng',
  authDomain: 'naveen-a3142.firebaseapp.com',
  databaseURL: 'https://naveen-a3142-default-rtdb.firebaseio.com',
  projectId: 'naveen-a3142',
  storageBucket: 'naveen-a3142.firebasestorage.app',
  messagingSenderId: '277562843592',
  appId: '1:277562843592:web:54ab2d210f007d75bca0fd',
  measurementId: 'G-7KXYFK1N5V',
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Safely initialize Analytics in browser environments
export let analytics = null;
if (typeof window !== 'undefined') {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {});
}

// Initialize Firebase Realtime Database & Cloud Storage
export const database = getDatabase(app);
export const storage = getStorage(app);

const SITE_DATA_PATH = 'naveenProEditor/siteData';
const INQUIRIES_PATH = 'naveenProEditor/inquiries';

/**
 * Save complete site configuration (pricing, categories, portfolio, quotation config, profile, SEO)
 * to Firebase Realtime Database.
 */
export async function saveSiteDataToFirebase(siteData) {
  try {
    const cleanData = JSON.parse(JSON.stringify(siteData));
    await set(dbRef(database, SITE_DATA_PATH), {
      ...cleanData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('Firebase saveSiteData warning:', err.message);
    return false;
  }
}

/**
 * Save client inquiries (Hire forms, Unsatisfied custom messages, Quotations) to Firebase Realtime Database.
 */
export async function saveInquiriesToFirebase(inquiriesList) {
  try {
    const cleanList = JSON.parse(JSON.stringify(inquiriesList || []));
    await set(dbRef(database, INQUIRIES_PATH), cleanList);
    return true;
  } catch (err) {
    console.warn('Firebase saveInquiries warning:', err.message);
    return false;
  }
}

/**
 * Subscribe to real-time updates for siteData from Firebase Realtime Database.
 */
export function subscribeToFirebaseSiteData(onDataCallback, onStatusChange) {
  const reference = dbRef(database, SITE_DATA_PATH);
  return onValue(
    reference,
    (snapshot) => {
      if (onStatusChange) onStatusChange('connected');
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (val && typeof val === 'object') {
          onDataCallback(val);
        }
      }
    },
    (err) => {
      console.warn('Firebase Realtime DB siteData subscription notice:', err.message);
      if (onStatusChange) onStatusChange('local_fallback');
    }
  );
}

/**
 * Subscribe to real-time updates for inquiries from Firebase Realtime Database.
 */
export function subscribeToFirebaseInquiries(onInquiriesCallback) {
  const reference = dbRef(database, INQUIRIES_PATH);
  return onValue(
    reference,
    (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        if (Array.isArray(val)) {
          onInquiriesCallback(val);
        } else if (val && typeof val === 'object') {
          onInquiriesCallback(Object.values(val));
        }
      }
    },
    (err) => {
      console.warn('Firebase Realtime DB inquiries subscription notice:', err.message);
    }
  );
}

/**
 * Check initial Firebase data and seed default data if the database node is empty.
 */
export async function ensureFirebaseSeeded(defaultSiteData, defaultInquiries) {
  try {
    const siteSnap = await get(dbRef(database, SITE_DATA_PATH));
    if (!siteSnap.exists()) {
      await saveSiteDataToFirebase(defaultSiteData);
    }
    const inqSnap = await get(dbRef(database, INQUIRIES_PATH));
    if (!inqSnap.exists()) {
      await saveInquiriesToFirebase(defaultInquiries);
    }
    return true;
  } catch (err) {
    console.warn('Firebase initial seed check notice:', err.message);
    return false;
  }
}

/**
 * Upload a video or image file to Firebase Cloud Storage with real-time progress reporting.
 */
export function uploadFileToFirebaseStorage(file, folder = 'videos', onProgress) {
  return new Promise((resolve, reject) => {
    try {
      const safeName = `${Date.now()}-${String(file.name || 'media.mp4').replace(
        /[^a-zA-Z0-9._-]/g,
        '_'
      )}`;
      const fileRef = storageRef(storage, `naveenProEditor/${folder}/${safeName}`);
      const uploadTask = uploadBytesResumable(fileRef, file, {
        contentType: file.type || 'video/mp4',
      });

      // Timeout safety in case Storage bucket isn't enabled or rules block unauthenticated uploads
      const timeoutId = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('Firebase Storage upload timed out; using local/IndexedDB fallback'));
      }, 20000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0 && onProgress) {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            onProgress(Math.max(10, pct));
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        async () => {
          clearTimeout(timeoutId);
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve({
              url: downloadUrl,
              storageType: 'firebase_storage',
              name: file.name,
              size: file.size,
              type: file.type,
            });
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

