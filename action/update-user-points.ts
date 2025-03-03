"use server";

import { db } from "@/lib/db";

export const updateUserPoints = async (userId: string, points: number) => {
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      points: {
        increment: points,
      },
    },
  });

  return updatedUser;
};
