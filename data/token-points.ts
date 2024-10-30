import { db } from "@/lib/db";

export const getUserPoints = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  return user?.points;
};
