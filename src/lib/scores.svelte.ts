import { today } from "./date";

const DB_NAME = "typing";
const DB_VERSION = 1;

const db = openDB();

/**
Score stores the average score for a day.
*/
export interface Score {
    date: Date;
    wpm: number;
    accuracy: number;
    fastest: number;
    count: number;
};

/**
Stores a cache of recently updated scores.
*/
export const cache: { scores: Score[] } = $state({ scores: [] });

/**
Opens the database containing the scores.
*/
function openDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    return new Promise<IDBDatabase>((resolve, reject) => {
        request.onerror = function() {
            reject(`Database error: ${this.error?.message}`);
        };

        request.onupgradeneeded = function() {
            const db = this.result;
            const store = db.createObjectStore("scores", { keyPath: "date" });

            store.createIndex("date", "date", { unique: true });
        };

        request.onblocked = function() {
            reject(`Database upgrade blocked: ${this.error?.message}`);
        }

        request.onsuccess = function() {
            resolve(this.result);
        };
    });
}

/**
Gets the score in the database for a day.
*/
export async function getScore(date: Date) {
    const request = (await db)
        .transaction("scores")
        .objectStore("scores")
        .get(date);

    return new Promise<Score>((resolve, reject) => {
        request.onerror = function() {
            reject(`Failed to get score: ${this.error?.message}`);
        };

        request.onsuccess = function() {
            resolve(this.result);
        };
    });
}

/**
Gets all scores in the database for days between two dates inclusive.
*/
export async function getScores(from: Date, to: Date) {
    const scores: Score[] = [];
    const request = (await db)
        .transaction("scores")
        .objectStore("scores")
        .index("date")
        .openCursor(IDBKeyRange.bound(from, to));

    return new Promise<Score[]>((resolve, reject) => {
        request.onerror = function() {
            reject(`Failed to get scores: ${this.error?.message}`);
        };

        request.onsuccess = function() {
            const cursor = this.result;

            if (cursor) {
                scores.push(cursor.value);
                cursor.continue();
                return;
            }

            resolve(scores);
        };
    });
}

/**
Updates an average over n elements with a new sample.
*/
function updateAverage(average: number, n: number, newSample: number) {
    return (average * n + newSample) / (n + 1);
}

/**
Adds an individual score to the database and returns the updated score.
*/
export async function addScore(wpm: number, accuracy: number) {
    const store = (await db)
        .transaction("scores", "readwrite")
        .objectStore("scores");

    const date = today();
    const request = store.get(date);

    return new Promise<Score>((resolve, reject) => {
        request.onerror = function() {
            reject(`Failed to get score: ${this.error?.message}`);
        };

        request.onsuccess = function() {
            const score: Score = this.result ?? { date, wpm: 0, accuracy: 0, fastest: 0, count: 0 };

            score.wpm = updateAverage(score.wpm, score.count, wpm);
            score.accuracy = updateAverage(score.accuracy, score.count, accuracy);
            score.fastest = Math.max(score.fastest, wpm);
            score.count++;

            const request = store.put(score);

            request.onerror = function() {
                reject(`Failed to set score: ${this.error?.message}`);
            };

            request.onsuccess = function() {
                resolve(score);

                // Update cache
                const index = cache.scores.findIndex((score) => {
                    return score.date.getTime() === date.getTime();
                });

                if (index < 0) {
                    cache.scores.push(score);
                    return;
                }

                cache.scores[index] = score;
            };
        };
    });
}
