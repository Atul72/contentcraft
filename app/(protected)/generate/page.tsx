"use client";

import { useSession } from "next-auth/react";

import { signOutAction } from "@/action/logout";

export default function GeneratePage() {
  const { data: session } = useSession();

  const onClick = () => {
    signOutAction();
  };

  return (
    <>
      <p>{session?.user?.email}</p>
      <span onClick={onClick} className="cursor-pointer">
        <button>Logout</button>
      </span>
    </>
  );
}
