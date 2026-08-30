import type { Receipt, Recipe } from './types';

const REAL_DB_NAME = 'wrapline-local';
const DEMO_DB_NAME = 'demo:wrapline-local';
const DB_VERSION = 1;
let dbName = REAL_DB_NAME;

/** Demo data is physically separate so the real bench is never opened in demo mode. */
export function setStorageScope(demo: boolean): void {
  dbName = demo ? DEMO_DB_NAME : REAL_DB_NAME;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('recipes')) db.createObjectStore('recipes', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('receipts')) db.createObjectStore('receipts', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
  });
}

async function all<T>(storeName: string): Promise<T[]> {
  const db = await openDb();
  return new Promise<T[]>((resolve, reject) => {
    const request = db.transaction(storeName, 'readonly').objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

async function put<T>(storeName: string, value: T): Promise<void> {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put(value);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  }).finally(() => db.close());
}

export const getRecipes = () => all<Recipe>('recipes');
export const saveRecipe = (recipe: Recipe) => put('recipes', recipe);
export const getReceipts = () => all<Receipt>('receipts');
export const saveReceipt = (receipt: Receipt) => put('receipts', receipt);

export async function deleteRecipe(id: string): Promise<void> {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('recipes', 'readwrite');
    transaction.objectStore('recipes').delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  }).finally(() => db.close());
}

export function resetDemoStorage(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DEMO_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error('Could not reset demo storage.'));
    request.onblocked = () => reject(new Error('Close other Wrapline demo tabs, then reset the demo again.'));
  });
}
