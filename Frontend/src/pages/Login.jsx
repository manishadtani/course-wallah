import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice"; // Thunk
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "User",
  });

  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setSuccessMessage("Login successful");
      setTimeout(() => navigate("/"), 1500); // Later redirect to dashboard
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const endpoint =
      formData.role === "Instructor"
        ? "http://localhost:3000/api/v1/auth/login-instructor"
        : "http://localhost:3000/api/v1/auth/login";

    dispatch(loginUser({ email: formData.email, password: formData.password, endpoint }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-xl">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
          Welcome Back
        </h2>

        {(successMessage || error) && (
          <div
            className={`mb-4 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
              successMessage
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {successMessage || error}
          </div>
        )}

        {/* Role Switcher */}
        <div className="flex justify-center mb-6 bg-gray-100 rounded-full p-1">
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              formData.role === "User" ? "bg-purple-600 text-white shadow" : "text-gray-600"
            }`}
            onClick={() => handleRoleChange("User")}
          >
            User
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              formData.role === "Instructor" ? "bg-purple-600 text-white shadow" : "text-gray-600"
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
            autoComplete="current-password"
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
