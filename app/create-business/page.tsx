"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateBusiness() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    customType: "",
  });
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle business type selection
  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setFormData({ ...formData, type: selectedType, customType: "" });
  };

  // Submit the form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const finalType = formData.type === "Other" ? formData.customType : formData.type;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await axios.post(
        "http://localhost:5001/api/business",
        { name: formData.name, type: finalType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Create Your Business</h2>
        <p className="text-gray-600 text-center mb-6">Provide details about your business.</p>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Business Name"
            className="w-full p-3 border border-gray-300 rounded text-black"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            className="w-full p-3 border border-gray-300 rounded text-black"
            value={formData.type}
            onChange={handleTypeChange}
            required
          >
            <option value="" disabled>Select Business Type</option>
            <option value="Salon">Salon</option>
            <option value="Fitness">Fitness</option>
            <option value="Consulting">Consulting</option>
            <option value="Retail">Retail</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>

          {formData.type === "Other" && (
            <input
              type="text"
              name="customType"
              placeholder="Enter your business type"
              className="w-full p-3 border border-gray-300 rounded text-black"
              value={formData.customType}
              onChange={handleChange}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700"
          >
            Create Business
          </button>
        </form>
      </div>
    </div>
  );
}