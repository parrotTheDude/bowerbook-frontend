"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import PublicLayout from "../../layouts/PublicLayout";
import Image from "next/image";

export default function CreateAccount() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
    match: false,
  });

  // Auto-capitalize name as the user types
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedName = e.target.value
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    setName(formattedName);
  };

  // Handle password input and validation
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordChecks({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      symbol: /[\W_]/.test(value),
      match: value === confirmPassword,
    });
  };

  // Handle confirm password input
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordChecks((prev) => ({
      ...prev,
      match: password === value,
    }));
  };

  // Submit the form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/complete-registration", {
        email,
        name,
        password,
      });

      if (res.status === 200) {
        router.push(`/auth/select-role?email=${encodeURIComponent(email)}`);
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
          <h2 className="text-2xl font-bold text-center text-black mb-4">Create Your Account</h2>
          <p className="text-gray-600 text-center mb-4">Finish setting up your account for <strong>{email}</strong>.</p>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border border-gray-300 rounded text-black"
              value={name}
              onChange={handleNameChange}
              required
            />

            <input
              type="password"
              placeholder="Create a Password"
              className={`w-full p-3 border rounded text-black ${
                password && !passwordChecks.length ? "border-red-500" : "border-gray-300"
              }`}
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full p-3 border rounded text-black ${
                confirmPassword && !passwordChecks.match ? "border-red-500" : "border-gray-300"
              }`}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />

            {/* Password Validation Section */}
            <div className="text-sm text-gray-500 space-y-1">
              {[
                { key: "length", label: "8+ characters" },
                { key: "uppercase", label: "At least one uppercase letter" },
                { key: "lowercase", label: "At least one lowercase letter" },
                { key: "number", label: "At least one number" },
                { key: "symbol", label: "At least one special character" },
                { key: "match", label: "Passwords match" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <Image
                    src={passwordChecks[key as keyof typeof passwordChecks] ? "/correct.svg" : "/dot.svg"}
                    alt="status"
                    width={12}
                    height={12}
                  />
                  <span className={passwordChecks[key as keyof typeof passwordChecks] ? "text-green-600" : "text-gray-500"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
              disabled={
                !passwordChecks.length || 
                !passwordChecks.uppercase || 
                !passwordChecks.lowercase || 
                !passwordChecks.number || 
                !passwordChecks.symbol || 
                !passwordChecks.match
              }
            >
              Create Account
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