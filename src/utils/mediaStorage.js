// High-Quality Video & Media Storage Engine + INR Currency Formatter
// Supports Firebase Storage, local Vite server (/uploads/...), and IndexedDB fallback.

import { uploadFileToFirebaseStorage } from '../config/firebase';

const DB_NAME = 'naveen_editor_media_db';
const STORE_NAME = 'media_blobs';
const DB_VERSION = 1;

function openMediaDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const memoryBlobUrlCache = new Map();

export async function saveMediaFile(file, onProgress) {
  if (!file) throw new Error('No file provided');

  if (onProgress) onProgress(10);

  // 1. Try uploading to Firebase Cloud Storage first so the video URL is saved in Firebase globally
  try {
    const fbResult = await uploadFileToFirebaseStorage(
      file,
      file.type?.startsWith('image/') ? 'thumbnails' : 'videos',
      onProgress
    );
    if (fbResult && fbResult.url) {
      return fbResult;
    }
  } catch (fbErr) {
    console.warn('Firebase Storage fallback to local server/IndexedDB:', fbErr.message);
  }

  if (onProgress) onProgress(35);

  // 2. Try saving to local Vite server /public/uploads for permanent local file URL
  try {
    const response = await fetch('/api/upload-media', {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-file-name': encodeURIComponent(file.name || `video-${Date.now()}.mp4`),
      },
      body: file,
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.ok && data.url) {
        if (onProgress) onProgress(100);
        return {
          url: data.url,
          storageType: 'server',
          name: file.name,
          size: file.size,
          type: file.type,
        };
      }
    }
  } catch {
    // Fallback to IndexedDB below if static hosted
  }

  if (onProgress) onProgress(65);

  // 3. Fallback: Save full-quality binary Blob in IndexedDB
  const id = `media_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const db = await openMediaDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({
      id,
      blob: file,
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: Date.now(),
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  const objectUrl = URL.createObjectURL(file);
  const idbUri = `idb://${id}`;
  memoryBlobUrlCache.set(idbUri, objectUrl);

  if (onProgress) onProgress(100);

  return {
    url: idbUri,
    playableUrl: objectUrl,
    storageType: 'indexeddb',
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export async function resolvePlayableUrl(url) {
  if (!url) return '';
  if (!url.startsWith('idb://')) return url;

  if (memoryBlobUrlCache.has(url)) {
    return memoryBlobUrlCache.get(url);
  }

  try {
    const id = url.replace('idb://', '');
    const db = await openMediaDB();
    const record = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (record && record.blob) {
      const objectUrl = URL.createObjectURL(record.blob);
      memoryBlobUrlCache.set(url, objectUrl);
      return objectUrl;
    }
  } catch (err) {
    console.warn('Failed to resolve IndexedDB media URL:', err);
  }
  return '';
}

// Extract a high-quality JPEG thumbnail frame from a video File or URL
export function extractVideoThumbnail(videoSource, seekSeconds = 1.5) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      let tempObjectUrl = null;
      if (videoSource instanceof File || videoSource instanceof Blob) {
        tempObjectUrl = URL.createObjectURL(videoSource);
        video.src = tempObjectUrl;
      } else if (typeof videoSource === 'string') {
        video.src = videoSource;
      } else {
        resolve(null);
        return;
      }

      const cleanup = () => {
        if (tempObjectUrl) URL.revokeObjectURL(tempObjectUrl);
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 8000);

      video.onloadedmetadata = () => {
        const targetTime = Math.min(seekSeconds, Math.max(0.1, (video.duration || 2) * 0.25));
        video.currentTime = targetTime;
      };

      video.onseeked = () => {
        try {
          clearTimeout(timeoutId);
          const canvas = document.createElement('canvas');
          const maxW = 1280;
          const ratio =
            video.videoWidth && video.videoHeight ? video.videoWidth / video.videoHeight : 16 / 9;
          canvas.width = Math.min(video.videoWidth || 1280, maxW);
          canvas.height = Math.round(canvas.width / ratio);

          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          cleanup();
          resolve({
            thumbnailDataUrl: dataUrl,
            durationSeconds: video.duration || 0,
            width: video.videoWidth || 1920,
            height: video.videoHeight || 1080,
          });
        } catch {
          cleanup();
          resolve(null);
        }
      };

      video.onerror = () => {
        clearTimeout(timeoutId);
        cleanup();
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

// Format seconds into M:SS
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:45';
  const totalSec = Math.round(Number(seconds));
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Format file size nicely
export function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Format Indian Rupees with ₹ symbol and en-IN comma grouping
export function formatINR(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

// Format Indian Rupees for PDF generation
export function formatINRForPDF(amount) {
  const num = Number(amount) || 0;
  return `Rs. ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(num)}`;
}
