import PublicLayout from "./layouts/PublicLayout";
import Link from "next/link";

export default function Home() {
  return (
    <PublicLayout>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to BowerBook</h1>
        <p className="text-lg text-gray-600 mb-6">
          The easiest way to book and manage appointments for your business.
        </p>
        <Link href="/auth/signup" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Get Started
        </Link>
      </div>
    </PublicLayout>
  );
}