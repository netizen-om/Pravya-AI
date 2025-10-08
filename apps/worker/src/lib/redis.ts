import { Redis } from 'ioredis';

// Redis connection for BullMQ
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Publish resume status updates
export const publishResumeUpdate = async (resumeId: string, status: any) => {
  try {
    const redisPubSub = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    });

    await redisPubSub.publish('resume-status-update', JSON.stringify({
      resumeId,
      ...status,
      timestamp: new Date().toISOString()
    }));

    await redisPubSub.quit();
  } catch (error) {
    console.error('Error publishing resume status update:', error);
  }
};
