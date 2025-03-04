"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import PublicLayout from "../../layouts/PublicLayout"; // ✅ Import Public Layout

export default function SelectRole() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [error, setError] = useState("");

  const handleRoleSelect = async (role: "business_owner" | "customer") => {
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await axios.post(
        "http://localhost:5001/api/auth/select-role",
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("role", role);
      // ✅ Redirect Business Owners to `/create-business` before `/dashboard`
      router.push(role === "business_owner" ? "/create-business" : "/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Choose Your Role</h2>
          <p className="text-gray-600 mb-6">Select how you want to use BowerBook.</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={() => handleRoleSelect("business_owner")}
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 mb-4"
          >
            I am a Business Owner
          </button>

          <button
            onClick={() => handleRoleSelect("customer")}
            className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700"
          >
            I am a Customer
          </button>
        </div>
      </div>
    </PublicLayout>
  );
}