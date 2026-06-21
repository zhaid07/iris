import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold">Iris — Coming Soon</h1>
      <Link href="/sign-up" className="text-blue-600 underline">
        Sign up
      </Link>
    </main>
  );
}
