import dotenv from "dotenv";
dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fetch from "node-fetch";
import { Blob } from "buffer";
import { getVectorStore } from "../lib/vectorStore";
import { prisma } from "../lib/prisma";
import { publishResumeUpdate } from "../lib/redis";

export const resumeParser = async (job) => {
    const { fileUrl, userId, resumeId } = job.data;

    try {
      console.log("Job Data: ", job.data);

      // Update QdrantStatus to parsing
      await prisma.resume.update({
        where: { id: resumeId },
        data: { QdrantStatus: "parsing" },
      });

      // Publish status update
      await publishResumeUpdate(resumeId, { QdrantStatus: "parsing" });

      console.log("Downloading from Cloudinary:", fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok)
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();

      // Load PDF from memory using a Blob
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      // @ts-ignore
      const loader = new PDFLoader(blob);
      const docs = await loader.load();

      const docsWithMetadata = docs.map((doc) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          userId,
          resumeId,
        },
      }));

      console.log(`Loaded ${docsWithMetadata.length} chunks with metadata`);

      const store = await getVectorStore();

      await store.addDocuments(docsWithMetadata);

      console.log("All docs added to Qdrant with metadata");

      // Update QdrantStatus to completed
      await prisma.resume.update({
        where: { id: resumeId },
        data: { QdrantStatus: "completed" },
      });

      // Publish status update
      await publishResumeUpdate(resumeId, { QdrantStatus: "completed" });
    } catch (error) {
      console.error("ERROR:", error);

      // Update QdrantStatus to error if something goes wrong
      await prisma.resume.update({
        where: { id: resumeId },
        data: { QdrantStatus: "error" },
      });

      // Publish error status
      await publishResumeUpdate(resumeId, { QdrantStatus: "error" });
    }
  }
