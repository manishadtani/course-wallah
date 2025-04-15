import React, { useState } from "react";
import axios from "axios";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    brandSlug: "",
    role: "User",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const endpoint =
        formData.role === "Instructor"
          ? "http://localhost:3000/api/v1/auth/register-instructor"
          : "http://localhost:3000/api/v1/auth/register";

      const payload =
        formData.role === "Instructor"
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              brandSlug: formData.brandSlug,
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            };

      const res = await axios.post(endpoint, payload);
      setMessage(res.data.message);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        brandSlug: "",
        role: "User",
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
          Create Your Account
        </h2>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              success
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Role Switcher */}
        <div className="flex justify-center mb-6 bg-gray-100 rounded-full p-1">
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              formData.role === "User"
                ? "bg-purple-600 text-white shadow"
                : "text-gray-600"
            }`}
            onClick={() => handleRoleChange("User")}
          >
            User
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              formData.role === "Instructor"
                ? "bg-purple-600 text-white shadow"
                : "text-gray-600"
            }`}
            onClick={() => handleRoleChange("Instructor")}
          >
            Instructor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {formData.role === "Instructor" && (
            <input
              type="text"
              name="brandSlug"
              placeholder="Academy Name (e.g., manish-academy)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.brandSlug}
              onChange={handleChange}
              required
            />
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;