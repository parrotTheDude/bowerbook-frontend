"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  id: string;
  name: string;
  role: "business_owner" | "customer" | "admin";
}

interface Booking {
  id: string;
  date: string;
  service: { name: string };
}

interface DashboardData {
  user: User;
  business?: { name: string; totalRevenue: number; totalBookings: number };
  bookings?: Booking[];
}

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5001/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-black mb-6">Dashboard</h1>

      {data?.user.role === "business_owner" && data.business ? (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold text-black">Business Overview</h2>
          <p className="text-gray-700">Business Name: {data.business.name}</p>
          <p className="text-gray-700">Total Revenue: ${data.business.totalRevenue}</p>
          <p className="text-gray-700">Total Bookings: {data.business.totalBookings}</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold text-black">Upcoming Bookings</h2>
          {data?.bookings && data.bookings.length > 0 ? (
            <ul className="mt-4">
              {data.bookings.map((booking) => (
                <li key={booking.id} className="text-gray-700 border-b py-2">
                  {booking.service.name} - {new Date(booking.date).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No upcoming bookings.</p>
          )}
        </div>
      )}
    </div>
  );
}