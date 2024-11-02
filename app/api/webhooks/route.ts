/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { updateUserPoints } from "@/action/update-user-points";
import { createOrUpdateSubscription } from "@/action/create-or-update-subscription";
import { receiveMessageOnPort } from "worker_threads";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  console.log(`Webhook received: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    const subscriptionId = session.subscription as string;

    if (!userId || !subscriptionId) {
      console.error("Missing user id or subscription id", { session });
      return NextResponse.json(
        { error: "Missing user id or subscription id" },
        { status: 400 }
      );
    }

    try {
      console.log(`Retrieving subscription ${subscriptionId}`);
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log(`Subscription retrieved: ${subscription.id}`);

      if (!subscription.items.data.length) {
        console.error("No items found in subscription", { subscription });
        return NextResponse.json(
          { error: "Invalid subscription data" },
          { status: 400 }
        );
      }

      const priceId = subscription.items.data[0].price.id;
      console.log(`Price id: ${priceId}`);

      let plan: string;
      let pointsToAdd: number;

      switch (priceId) {
        case "price_1PyFKGBibz3ZDixDAaJ3HO74":
          plan = "Basic";
          pointsToAdd = 100;
          break;
        case "price_1PyFN0Bibz3ZDixDqm9eYL8W":
          plan = "Pro";
          pointsToAdd = 500;
          break;
        default:
          console.error("Unknown price ID", { priceId });
          return NextResponse.json(
            { error: "Unknown price ID" },
            { status: 400 }
          );
      }

      console.log(`Creating or updating subscription for ${userId}`);
      const updateSubscription = await createOrUpdateSubscription(
        subscriptionId,
        userId,
        plan,
        subscription.status,
        new Date(subscription.current_period_start * 1000),
        new Date(subscription.current_period_end * 1000)
      );

      if (!updateSubscription) {
        console.error("Error creating or updating subscription");
        return NextResponse.json(
          { error: "Error creating or updating subscription" },
          { status: 500 }
        );
      }

      console.log(`Updating points for ${userId}`);
      await updateUserPoints(userId, pointsToAdd);
    } catch (error) {
      console.error("Error creating or updating subscription", { error });
      return NextResponse.json(
        { error: "Error creating or updating subscription" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
