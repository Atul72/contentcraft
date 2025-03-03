"use server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const createPayment = async ({ price }: { price: number }) => {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { id: userId } = session.user;

  const payment = await db.payments.create({
    data: {
      userId: userId as string,
      amount: price,
      status: "success",
    },
  });

  if (!payment) {
    throw new Error("Payment failed");
  }

  if (price === 9) {
    await db.user.update({
      where: { id: userId as string },
      data: { points: { increment: 100 } },
    });
  }

  if (price === 29) {
    await db.user.update({
      where: { id: userId as string },
      data: { points: { increment: 500 } },
    });
  }

  return {
    success: true,
    paymentId: payment.id,
  };
};
