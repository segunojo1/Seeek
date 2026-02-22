import Image from "../frontend/node_modules/next/image";
import Link from "../frontend/node_modules/next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1F1F1F] px-6 text-white">
      <div className="flex max-w-md flex-col items-center text-center gap-8">
        <Image
          src="/assets/logo.png"
          alt="Seek"
          width={120}
          height={105}
          priority
        />

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to <span className="text-[#E89E28]">Seek</span>
          </h1>
          <p className="text-[#A3A3A3] text-lg leading-relaxed">
            Your personalized nutrition companion. Scan meals, get health
            insights, and make smarter food choices.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/auth/login"
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-[#E89E28] text-base font-semibold text-black transition-colors hover:bg-[#d48d1f]"
          >
            Log In
          </Link>
          <Link
            href="/auth/signup"
            className="flex h-12 flex-1 items-center justify-center rounded-full border border-[#E89E28] text-base font-semibold text-[#E89E28] transition-colors hover:bg-[#E89E28]/10"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
