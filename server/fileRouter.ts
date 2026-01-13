import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { createFile, getUserFiles, getFileById, deleteFile } from "./fileDb";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

export const fileRouter = router({
  // Upload file
  upload: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
        category: z.enum(["documento", "relatorio", "dados", "outro"]),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Decode base64 to buffer
      const buffer = Buffer.from(input.fileData, "base64");
      const fileSize = buffer.length;

      // Generate unique file key
      const fileKey = `user-${ctx.user.id}/files/${nanoid()}-${input.fileName}`;

      // Upload to S3
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      // Save metadata to database
      await createFile({
        userId: ctx.user.id,
        fileName: input.fileName,
        fileKey,
        fileUrl: url,
        mimeType: input.mimeType,
        fileSize,
        category: input.category,
        description: input.description || null,
      });

      return {
        success: true,
        url,
        message: "Ficheiro enviado com sucesso",
      };
    }),

  // List user files
  list: protectedProcedure.query(async ({ ctx }) => {
    return await getUserFiles(ctx.user.id);
  }),

  // Get file by ID
  get: protectedProcedure
    .input(z.object({ fileId: z.number() }))
    .query(async ({ ctx, input }) => {
      const file = await getFileById(input.fileId);
      if (!file || file.userId !== ctx.user.id) {
        throw new Error("Ficheiro não encontrado ou não autorizado");
      }
      return file;
    }),

  // Delete file
  delete: protectedProcedure
    .input(z.object({ fileId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deleteFile(input.fileId, ctx.user.id);
      return {
        success: true,
        message: "Ficheiro eliminado com sucesso",
      };
    }),
});
