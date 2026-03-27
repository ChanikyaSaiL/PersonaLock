/**
 * idbStore.js
 * Promise-based IndexedDB wrapper for persisting binary wizard data
 * (face image Files and voice recording Blobs) across page reloads.
 *
 * DB name  : pl_wizard
 * Stores   : faceImages  — key: pose id (string),   value: File
 *            voiceSamples — key: sentence idx (number), value: Blob
 */

const DB_NAME = 'pl_wizard';
const DB_VERSION = 1;
const STORE_FACE = 'faceImages';
const STORE_VOICE = 'voiceSamples';

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_FACE)) {
                db.createObjectStore(STORE_FACE); // key = pose id
            }
            if (!db.objectStoreNames.contains(STORE_VOICE)) {
                db.createObjectStore(STORE_VOICE); // key = sentence index
            }
        };

        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror   = (e) => reject(e.target.error);
    });
}

// ── Face Images ────────────────────────────────────────────────────────────

export async function saveFile(poseId, file) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_FACE, 'readwrite');
        tx.objectStore(STORE_FACE).put(file, poseId);
        tx.oncomplete = resolve;
        tx.onerror    = (e) => reject(e.target.error);
    });
}

export async function deleteFile(poseId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_FACE, 'readwrite');
        tx.objectStore(STORE_FACE).delete(poseId);
        tx.oncomplete = resolve;
        tx.onerror    = (e) => reject(e.target.error);
    });
}

export async function loadAllFiles() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const results = {};
        const tx = db.transaction(STORE_FACE, 'readonly');
        const store = tx.objectStore(STORE_FACE);
        const req = store.openCursor();
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                results[cursor.key] = cursor.value; // File
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        req.onerror = (e) => reject(e.target.error);
    });
}

// ── Voice Samples ──────────────────────────────────────────────────────────

export async function saveAudio(idx, blob) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_VOICE, 'readwrite');
        tx.objectStore(STORE_VOICE).put(blob, idx);
        tx.oncomplete = resolve;
        tx.onerror    = (e) => reject(e.target.error);
    });
}

export async function deleteAudio(idx) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_VOICE, 'readwrite');
        tx.objectStore(STORE_VOICE).delete(idx);
        tx.oncomplete = resolve;
        tx.onerror    = (e) => reject(e.target.error);
    });
}

export async function loadAllAudio() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const results = {};
        const tx = db.transaction(STORE_VOICE, 'readonly');
        const store = tx.objectStore(STORE_VOICE);
        const req = store.openCursor();
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                const blob = cursor.value; // Blob
                results[cursor.key] = { blob, url: URL.createObjectURL(blob) };
                cursor.continue();
            } else {
                resolve(results);
            }
        };
        req.onerror = (e) => reject(e.target.error);
    });
}

// ── Clear All ──────────────────────────────────────────────────────────────

export async function clearAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([STORE_FACE, STORE_VOICE], 'readwrite');
        tx.objectStore(STORE_FACE).clear();
        tx.objectStore(STORE_VOICE).clear();
        tx.oncomplete = resolve;
        tx.onerror    = (e) => reject(e.target.error);
    });
}
