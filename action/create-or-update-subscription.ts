/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/db";

export const createOrUpdateSubscription = async (
  userId: string,
  stripeSubscriptionId: string,
  plan: string,
  status: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) => {
  try {
    const user = await db.user.findFirst({
      where: {
        stripeCustomerId: userId,
      },
    });

    if (!user) {
      console.error("User not found", { userId });
      return null;
    }

    const existingSubscription = await db.subscription.findFirst({
      where: {
        stripeSubscriptionId,
      },
    });

    let subscription;

    if (existingSubscription) {
      subscription = await db.subscription.update({
        where: {
          id: existingSubscription.id,
        },
        data: {
          status,
          plan,
          currentPeriodStart,
          currentPeriodEnd,
        },
      });
    } else {
      subscription = await db.subscription.create({
        data: {
          stripeSubscriptionId,
          status,
          plan,
          currentPeriodStart,
          currentPeriodEnd,
          user: { connect: { id: user.id } },
        },
      });
    }

    return subscription;
  } catch (error) {
    console.error("Error creating or updating subscription", { error });
    return null;
  }
};
