import { openDB } from "idb";

const DB_NAME = "MINING";
const DB_VERSION = 1;

const DATASET = "dataset";


const saveMoveToIndexedDB = async (move, label) => {
    const db = await openDB("miningGameDB", 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains("moves")) {
                db.createObjectStore("moves", { autoIncrement: true });
            }
        },
    });

    const tx = db.transaction("moves", "readwrite");
    const store = tx.objectStore("moves");
    await store.add({ move, label });
    await tx.done;
}

const loadAllMoves = async () => {
    const db = await openDB("miningGameDB", 1);
    const tx = db.transaction("moves", "readonly");
    const store = tx.objectStore("moves");
    const allMoves = await store.getAll();
    await tx.done;
    return allMoves;
}

export {
    saveMoveToIndexedDB,
    loadAllMoves,
};