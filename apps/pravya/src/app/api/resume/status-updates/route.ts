import { NextRequest, NextResponse } from 'next/server';
import { subscribeToResumeUpdates } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Subscribe to Redis updates
      const subscriber = subscribeToResumeUpdates((data) => {
        try {
          const message = `data: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          console.error('Error sending status update:', error);
        }
      });

      req.signal.addEventListener('abort', () => {
        subscriber.quit();
        controller.close();
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
