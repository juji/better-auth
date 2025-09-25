
import { NExtjsFormWithSuspense } from "@/components/forms/nextjs";
import Link from "next/link";


export default function Home() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1>Auth experiment with <Link
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
        href="https://www.better-auth.com" target="_blank" rel="noopener noreferrer">Better-Auth</Link></h1>
      <NExtjsFormWithSuspense />
    </div>
  );
}
