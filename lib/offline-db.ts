// Breakthrough OS Offline-First Persistence Engine (IndexedDB)
// Designed for NDIS Allied Health zero-connectivity field assessments and home visits

import { OfflineSyncQueueItem, Client, CaseNote } from '@/types';

const DB_NAME = 'BreakthroughOfflineDB_v1';
const DB_VERSION = 1;

export interface OfflineDBInstance {
  db: IDBDatabase | null;
  isAvailable: boolean;
}

export const isIndexedDBAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'indexedDB' in window;
};

export const openOfflineDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Offline Mutations Queue
      if (!db.objectStoreNames.contains('offline_queue')) {
        const queueStore = db.createObjectStore('offline_queue', { keyPath: 'id' });
        queueStore.createIndex('status', 'status', { unique: false });
        queueStore.createIndex('createdAt', 'createdAt', { unique: false });
        queueStore.createIndex('entityType', 'entityType', { unique: false });
      }

      // 2. Cached Clients / Participants for offline field consultations
      if (!db.objectStoreNames.contains('cached_clients')) {
        db.createObjectStore('cached_clients', { keyPath: 'id' });
      }

      // 3. Cached Clinical Case Notes
      if (!db.objectStoreNames.contains('cached_case_notes')) {
        db.createObjectStore('cached_case_notes', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Save an offline mutation item into IndexedDB
 */
export const saveOfflineQueueItem = async (item: OfflineSyncQueueItem): Promise<void> => {
  if (!isIndexedDBAvailable()) return;
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('offline_queue', 'readwrite');
      const store = transaction.objectStore('offline_queue');
      const request = store.put(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to persist to IndexedDB offline queue:', err);
  }
};

/**
 * Get all queued offline mutations from IndexedDB
 */
export const getAllOfflineQueueItems = async (): Promise<OfflineSyncQueueItem[]> => {
  if (!isIndexedDBAvailable()) return [];
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('offline_queue', 'readonly');
      const store = transaction.objectStore('offline_queue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to retrieve IndexedDB offline queue:', err);
    return [];
  }
};

/**
 * Delete a specific queue item once confirmed by server
 */
export const deleteOfflineQueueItem = async (id: string): Promise<void> => {
  if (!isIndexedDBAvailable()) return;
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('offline_queue', 'readwrite');
      const store = transaction.objectStore('offline_queue');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to delete item from IndexedDB offline queue:', err);
  }
};

/**
 * Cache participants locally for instant offline loading during field appointments
 */
export const cacheClientsLocally = async (clients: Client[]): Promise<void> => {
  if (!isIndexedDBAvailable()) return;
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cached_clients', 'readwrite');
      const store = transaction.objectStore('cached_clients');
      store.clear();
      clients.forEach((c) => store.put(c));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('Failed to cache participants locally in IndexedDB:', err);
  }
};

/**
 * Retrieve cached participants when offline
 */
export const getCachedClientsLocally = async (): Promise<Client[]> => {
  if (!isIndexedDBAvailable()) return [];
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('cached_clients', 'readonly');
      const store = transaction.objectStore('cached_clients');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to load cached participants from IndexedDB:', err);
    return [];
  }
};
