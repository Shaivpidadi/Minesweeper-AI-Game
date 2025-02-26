const DB_NAME = "MINING";
const DB_VERSION = 1;

const DATASET = "dataset";

const openDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(DATASET, { keyPath: "id" });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Failed to open IndexedDB");
    });
};

const saveToIndexedDB = async (collection, key, value) => {
    const db = await openDatabase();
    const transaction = db.transaction(collection, "readwrite");
    const store = transaction.objectStore(collection);
    store.put({ id: key, data: value });
};

const loadFromIndexedDB = async (collection, key) => {
    const db = await openDatabase();
    const transaction = db.transaction(collection, "readonly");
    const store = transaction.objectStore(collection);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result?.data || null);
        request.onerror = () => reject("Failed to retrieve data from IndexedDB");
    });
};

const clearIndexedDB = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(DB_NAME);
        request.onsuccess = () => {
            console.log(`Database ${DB_NAME} deleted successfully`);
            resolve();
        };
        request.onerror = (event) => {
            console.error(`Error deleting database: ${event.target.errorCode}`);
            reject(event);
        };
        request.onblocked = () => {
            console.warn(`Database deletion blocked`);
        };
    });
};

export {
    loadFromIndexedDB,
    saveToIndexedDB,
    clearIndexedDB,
};