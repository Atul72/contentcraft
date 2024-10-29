"use server";

import { signOut } from "@/auth";
import { revalidatePath } from "next/cache";

export async function signOutAction() {
  await signOut({ redirectTo: "/auth/login" });
  revalidatePath("/");
}
