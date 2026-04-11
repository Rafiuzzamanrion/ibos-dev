import { openDB } from "idb";

const DB_NAME = "assessment-platform";
const STORE_NAME = "exam-answers";
const DB_VERSION = 1;

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function saveAnswersOffline(
  answers: Record<string, string | string[]>
): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, answers, "exam_answers_draft");
}

export async function loadAnswersOffline(): Promise<Record<
  string,
  string | string[]
> | null> {
  const db = await getDB();
  const result = await db.get(STORE_NAME, "exam_answers_draft");
  return result || null;
}

export async function clearOfflineAnswers(): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, "exam_answers_draft");
}
