import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("fileRouter", () => {
  it("should upload a file successfully", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const testFileData = Buffer.from("test file content").toString("base64");

    const result = await caller.files.upload({
      fileName: "test.txt",
      fileData: testFileData,
      mimeType: "text/plain",
      category: "documento",
      description: "Test file",
    });

    expect(result.success).toBe(true);
    expect(result.url).toBeDefined();
    expect(result.message).toBe("Ficheiro enviado com sucesso");
  });

  it("should list user files", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Upload a test file first
    const testFileData = Buffer.from("test content").toString("base64");
    await caller.files.upload({
      fileName: "list-test.txt",
      fileData: testFileData,
      mimeType: "text/plain",
      category: "dados",
    });

    // List files
    const files = await caller.files.list();

    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);
    expect(files[0]).toHaveProperty("fileName");
    expect(files[0]).toHaveProperty("fileUrl");
    expect(files[0]).toHaveProperty("category");
  });

  it("should get a specific file by ID", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Upload a test file
    const testFileData = Buffer.from("get test content").toString("base64");
    await caller.files.upload({
      fileName: "get-test.txt",
      fileData: testFileData,
      mimeType: "text/plain",
      category: "relatorio",
    });

    // Get the uploaded files
    const files = await caller.files.list();
    const uploadedFile = files[0];

    // Get specific file
    const file = await caller.files.get({ fileId: uploadedFile.id });

    expect(file).toBeDefined();
    expect(file.id).toBe(uploadedFile.id);
    expect(file.fileName).toBe(uploadedFile.fileName);
  });

  it("should delete a file successfully", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Upload a test file
    const testFileData = Buffer.from("delete test content").toString("base64");
    await caller.files.upload({
      fileName: "delete-test.txt",
      fileData: testFileData,
      mimeType: "text/plain",
      category: "outro",
    });

    // Get the uploaded file
    const filesBefore = await caller.files.list();
    const fileToDelete = filesBefore[0];

    // Delete the file
    const result = await caller.files.delete({ fileId: fileToDelete.id });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Ficheiro eliminado com sucesso");

    // Verify it's deleted
    const filesAfter = await caller.files.list();
    expect(filesAfter.length).toBe(filesBefore.length - 1);
  });

  it("should not allow unauthorized file access", async () => {
    const ctx1 = createAuthContext(1);
    const caller1 = appRouter.createCaller(ctx1);

    // User 1 uploads a file
    const testFileData = Buffer.from("private content").toString("base64");
    await caller1.files.upload({
      fileName: "private.txt",
      fileData: testFileData,
      mimeType: "text/plain",
      category: "documento",
    });

    const user1Files = await caller1.files.list();
    const privateFile = user1Files[0];

    // User 2 tries to access User 1's file
    const ctx2 = createAuthContext(2);
    const caller2 = appRouter.createCaller(ctx2);

    await expect(
      caller2.files.get({ fileId: privateFile.id })
    ).rejects.toThrow("Ficheiro não encontrado ou não autorizado");
  });
});
