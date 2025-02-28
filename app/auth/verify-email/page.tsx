"use client";
import { useState, useRef, FormEvent, ChangeEvent, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Countdown timer for resending verification code
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // Handle input change
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); // Allow only letters & numbers

    if (value) {
      setCode((prev) => {
        const newCode = [...prev];
        newCode[index] = value.toUpperCase(); // Convert to uppercase
        return newCode;
      });

      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace to move focus back
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      setCode((prev) => {
        const newCode = [...prev];
        newCode[index] = "";
        return newCode;
      });

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Submit the verification code
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fullCode = code.join("");

    try {
      const res = await axios.post("http://localhost:5001/api/auth/verify-code", { email, code: fullCode });
      if (res.status === 200) {
        router.push(`/auth/create-account?email=${encodeURIComponent(email)}`);
      }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            setError(err.response?.data?.message || "Something went wrong");
          } else {
            setError("An unexpected error occurred");
          }
    }
  };

  // Resend verification code
  const handleResend = async () => {
    setError("");
    try {
      await axios.post("http://localhost:5001/api/auth/resend-verification", { email });
      setTimer(60);
    } catch (err) {
      setError("Failed to resend verification code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-black mb-4">Verify Your Email</h2>
        <p className="text-gray-600 text-center mb-4">Enter the 6-digit code sent to <strong>{email}</strong>.</p>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded text-black font-semibold tracking-widest uppercase"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400"
            disabled={code.some((digit) => digit === "")}
          >
            Verify
          </button>
        </form>
        <p className="text-sm text-center text-black mt-3">
          Didn't get a code?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={handleResend}
            disabled={timer > 0}
          >
            Resend Code {timer > 0 ? `in ${timer}s` : ""}
          </button>
        </p>
      </div>
    </div>
  );
}