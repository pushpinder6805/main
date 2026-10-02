"use client";

import Link from "next/link";
import {useAuth} from "@/app/contexts/AuthContext";

const classes = "rounded-md bg-blue-600 px-6 py-3 text-center font-bold text-white";

export default function CommunityHeroAction() {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return <span aria-label="Checking account" className={`${classes} animate-pulse opacity-70`}>Workspherepulse community</span>;
  }

  if (user) {
    return <span className={`${classes} cursor-default bg-blue-700`} aria-live="polite">Welcome to Workspherepulse</span>;
  }

  return <Link href="https://community.workspherepulse.com/" className={`${classes} transition-colors hover:bg-blue-700`}>
    Join Workspherepulse
  </Link>;
}
