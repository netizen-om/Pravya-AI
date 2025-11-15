import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";

const webhookSecret = process.env.DODOPAYMENTS_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    // Get webhook headers
    const webhookId = req.headers.get("webhook-id");
    const webhookSignature = req.headers.get("webhook-signature");
    const webhookTimestamp = req.headers.get("webhook-timestamp");

    if (!webhookId || !webhookSignature || !webhookTimestamp) {
      return NextResponse.json(
        { error: "Missing webhook headers" },
        { status: 400 }
      );
    }

    // Get raw body
    const body = await req.text();

    // Verify webhook signature
    const webhook = new Webhook(webhookSecret);

    try {
      await webhook.verify(body, {
        "webhook-id": webhookId,
        "webhook-signature": webhookSignature,
        "webhook-timestamp": webhookTimestamp,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // Parse the verified payload
    const payload = JSON.parse(body);

    // Handle different webhook events
    switch (payload.type) {
      case "payment.succeeded":
        console.log("Payment succeeded:", payload.data);
        // Handle successful payment
        // Update your database, send confirmation email, etc.
        break;

      case "payment.failed":
        console.log("Payment failed:", payload.data);
        // Handle failed payment
        break;

      case "subscription.created":
        console.log("Subscription created:", payload.data);
        // Handle new subscription
        break;

      case "subscription.cancelled":
        console.log("Subscription cancelled:", payload.data);
        // Handle subscription cancellation
        break;

      default:
        console.log("Unhandled webhook event:", payload.type);
    }

    // Return success response
    return NextResponse.json(
      { received: true, type: payload.type },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}