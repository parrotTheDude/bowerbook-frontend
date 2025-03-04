import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo Link */}
          <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700">
            BowerBook
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link href="/features" className="text-gray-700 hover:text-green-600">Features</Link>
            <Link href="/auth/login" className="text-gray-700 hover:text-green-600">Login</Link>
            <Link href="/auth/register" className="text-white bg-green-600 px-4 py-2 rounded-md hover:bg-green-700">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-6xl mx-auto p-6">{children}</main>

      {/* Footer */}
      <footer className="bg-white shadow-md text-center py-4 text-gray-500">
        &copy; {new Date().getFullYear()} BowerBook. All rights reserved.
      </footer>
    </div>
  );
}