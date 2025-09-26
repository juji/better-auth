
import { NExtjsFormWithSuspense } from "@/components/forms/nextjs";
import { ExpressFormWithSuspense } from "@/components/forms/express";
import { HonoFormWithSuspense } from "@/components/forms/hono";
import Link from "next/link";


export default function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1>Auth experiment with <Link
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
        href="https://www.better-auth.com" target="_blank" rel="noopener noreferrer">Better-Auth</Link></h1>
      <hr className="my-8 w-full border-t border-gray-300 dark:border-gray-700" />
      <NExtjsFormWithSuspense />
      <hr className="my-8 w-full border-t border-gray-300 dark:border-gray-700" />
      <ExpressFormWithSuspense />
      <hr className="my-8 w-full border-t border-gray-300 dark:border-gray-700" />
      <HonoFormWithSuspense />
    </div>
  );
}
