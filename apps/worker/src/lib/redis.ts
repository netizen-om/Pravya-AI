import Redis from "ioredis";

console.log(process.env.REDIS_URL);

// Redis connection for BullMQ
export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Publish resume status updates
export const publishResumeUpdate = async (resumeId: string, status: any) => {
  try {
    const redisPubSub = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });

    await redisPubSub.publish(
      "resume-status-update",
      JSON.stringify({
        resumeId,
        ...status,
        timestamp: new Date().toISOString(),
      })
    );

    await redisPubSub.quit();
  } catch (error) {
    console.error("Error publishing resume status update:", error);
  }
};
