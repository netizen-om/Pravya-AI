import { Redis } from 'ioredis';

// Redis connection for BullMQ
export const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Subscribe to resume status updates
export const subscribeToResumeUpdates = (callback: (data: any) => void) => {
  const subscriber = redis.duplicate();
  
  subscriber.subscribe('resume-status-update', (err, count) => {
    if (err) {
      console.error('Failed to subscribe to resume status updates:', err);
      return;
    }
    console.log(`Subscribed to resume status updates. Active subscriptions: ${count}`);
  });

  subscriber.on('message', (channel, message) => {
    try {
      const data = JSON.parse(message);
      callback(data);
    } catch (error) {
      console.error('Error parsing resume status update:', error);
    }
  });

  return subscriber;
};

// Publish resume status updates
export const publishResumeUpdate = async (resumeId: string, status: any) => {
  try {
    await redis.publish('resume-status-update', JSON.stringify({
      resumeId,
      ...status,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error publishing resume status update:', error);
  }
};
