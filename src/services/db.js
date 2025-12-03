import { openDB } from 'idb';

const DB_NAME = 'tb-cube-db';
const DB_VERSION = 1;
const STORE_NAME = 'sessions';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export const db = {
  async getUserData(userId) {
    return (await dbPromise).get(STORE_NAME, userId);
  },
  async saveUserData(userId, sessions) {
    // Clone to ensure plain object (remove Vue reactivity)
    const plainSessions = JSON.parse(JSON.stringify(sessions));
    return (await dbPromise).put(STORE_NAME, plainSessions, userId);
  },
};
