import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "User", // default role
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
          ? "http://localhost:3000/api/v1/auth/login-instructor"
          : "http://localhost:3000/api/v1/auth/login";

      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const res = await axios.post(endpoint, payload);
      setMessage(res.data.message || "Login successful");
      setSuccess(true);
      // Store token, navigate to dashboard, etc. here
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
          Welcome Back
        </h2>

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
            autoComplete="current password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;