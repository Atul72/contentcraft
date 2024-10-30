"use client";

import { useSession } from "next-auth/react";

export default function GeneratePage() {
  const { data: session } = useSession();

  return (
    <>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.image}</p>
    </>
  );
}
