"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PublicLayout from "../../layouts/PublicLayout";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", formData);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token); // Store token
        router.push("/dashboard"); // Redirect to dashboard
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          // ✅ Save email to localStorage and redirect to signup
          localStorage.setItem("pendingEmail", formData.email);
          router.push("/auth/register");
        } else {
          setError(err.response?.data?.message || "Invalid email or password");
        }
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <PublicLayout>
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center text-black mb-4">Login to Your Account</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded text-black"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded text-black"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center text-black mt-3">
            Don't have an account?{" "}
            <a href="/auth/register" className="text-blue-600 hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}