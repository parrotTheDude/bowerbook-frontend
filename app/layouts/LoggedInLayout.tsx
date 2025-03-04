"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface User {
  name: string;
  role: "business_owner" | "customer" | "admin";
}

export default function LoggedInLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await axios.get("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (error) {
        router.push("/auth/login");
      }
    };

    fetchUser();
  }, [router]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg min-h-screen">
        <div className="p-6 text-center border-b">
          <Link href="/" className="text-2xl font-bold text-green-600 hover:text-green-700">
            BowerBook
          </Link>
          <p className="text-gray-500 text-sm">{user.role === "business_owner" ? "Business Owner" : "Customer"}</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="block p-3 text-gray-700 hover:bg-gray-200 rounded-md">
                Dashboard
              </Link>
            </li>
            {user.role === "business_owner" && (
              <>
                <li>
                  <Link href="/services" className="block p-3 text-gray-700 hover:bg-gray-200 rounded-md">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/bookings" className="block p-3 text-gray-700 hover:bg-gray-200 rounded-md">
                    Bookings
                  </Link>
                </li>
              </>
            )}
            {user.role === "customer" && (
              <li>
                <Link href="/my-bookings" className="block p-3 text-gray-700 hover:bg-gray-200 rounded-md">
                  My Bookings
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Navbar */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
          <button
                onClick={() => {
                    localStorage.removeItem("token"); // ✅ Remove token
                    router.push("/auth/login"); // ✅ Redirect to login
                }}
                className="text-red-500"
                >
                Logout
            </button>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}