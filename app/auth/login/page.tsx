"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <>
      <div>LoginPage</div>
      <Button onClick={() => signIn("google", { callbackUrl: "/generate" })}>
        Login
      </Button>
    </>
  );
}
