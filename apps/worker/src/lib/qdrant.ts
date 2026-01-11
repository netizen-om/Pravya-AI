// import { QdrantClient } from "@qdrant/js-client-rest";

// export const qdrantClient = new QdrantClient({ url: process.env.QDRANT_URL });

import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_CLOUD_URL!,
  apiKey: process.env.QDRANT_CLOUD_API,
});
