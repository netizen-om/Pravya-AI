import { QdrantVectorStore } from "@langchain/qdrant";
import { embedding } from "./embedding";

export const getVectorStore = async () => {
  const store = await QdrantVectorStore.fromExistingCollection(embedding, {
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_PARSED_RESUME_COLLECTION_NAME,
  });

  return store;
};