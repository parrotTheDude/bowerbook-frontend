"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PublicLayout from "../../layouts/PublicLayout"; // ✅ Import Public Layout

export default function Signup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Validate email only after user stops typing
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (typingTimeout) clearTimeout(typingTimeout);

    const newTimeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsValidEmail(emailRegex.test(emailValue));
    }, 500);

    setTypingTimeout(newTimeout);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/request-verification", { email });

      if (res.status === 200 && res.data.redirectToLogin) {
        router.push("/auth/login");
      } else {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
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
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-3xl font-bold text-center text-black mb-4">Sign Up</h2>
          <p className="text-gray-600 text-center mb-4">Enter your email to get started.</p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded text-black ${
                email && !isValidEmail ? "border-red-500" : "border-gray-300"
              }`}
              value={email}
              onChange={handleEmailChange}
              required
            />
            {!isValidEmail && email && (
              <p className="text-red-500 text-sm">Please enter a valid email</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
              disabled={!isValidEmail}
            >
              Continue
            </button>
          </form>
          <p className="text-sm text-center text-black mt-3">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}