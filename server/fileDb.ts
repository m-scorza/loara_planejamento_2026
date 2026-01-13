import { eq, desc } from "drizzle-orm";
import { files, InsertFile } from "../drizzle/schema";
import { getDb } from "./db";

export async function createFile(file: InsertFile) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(files).values(file);
  return result;
}

export async function getUserFiles(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .select()
    .from(files)
    .where(eq(files.userId, userId))
    .orderBy(desc(files.createdAt));
}

export async function getFileById(fileId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(files)
    .where(eq(files.id, fileId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function deleteFile(fileId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Verify ownership before deleting
  const file = await getFileById(fileId);
  if (!file || file.userId !== userId) {
    throw new Error("File not found or unauthorized");
  }

  await db.delete(files).where(eq(files.id, fileId));
  return true;
}
