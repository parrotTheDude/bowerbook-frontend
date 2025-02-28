import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-green-600">BowerBook</h1>
        <Link href="/auth/login" className="flex items-center gap-2 text-blue-600 hover:underline">
          <Image src="/user.svg" alt="Login" width={24} height={24} />
          <span>Login</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Book and Manage Appointments Effortlessly
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl">
          BowerBook helps businesses and customers connect seamlessly. 
          Discover, book, and manage your appointments with ease.
        </p>
        <Link href="/auth/register" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
          Get Started
        </Link>
      </div>
    </div>
  );
}