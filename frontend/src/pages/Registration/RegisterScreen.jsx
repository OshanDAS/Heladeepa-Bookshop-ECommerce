import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // ✅ Import Framer Motion

// Page Transition Animation
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
    });

    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                formData
            );
            console.log(response.data);
            setSuccessMsg("Registration successful! Please check your email to verify your account.");
            setIsFormVisible(false);
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message?.includes("Duplicate entry")) {
                setSuccessMsg("Email is already registered. Please check your inbox to verify your account or try logging in.");
            } else {
                setSuccessMsg(error.response?.data?.message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen w-screen flex"
        >
            {/* Left Side - Background Image */}
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/images/bookshelf.jpg')` }}></div>

            {/* Right Side - Registration Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-[#6D4C41] to-[#8D6E63] px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-[#3E2723] sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        {!isFormVisible ? (
                            <div className={`text-sm font-medium text-center p-4 rounded border ${successMsg.includes("successful") ? "text-green-800 bg-green-100 border-green-300" : "text-red-800 bg-red-100 border-red-300"}`}>
                                {successMsg}
                            </div>
                        ) : (
                            <>
                                {/* Page Title */}
                                <h1 className="text-2xl font-bold text-center text-[#6D4C41]" style={{ fontFamily: '"Merriweather", serif' }}>
                                    Create an account
                                </h1>

                                {/* Success/Error Message */}
                                {successMsg && (
                                    <div className={`text-sm font-medium text-center mb-4 p-3 rounded border ${successMsg.includes("successful") ? "text-green-800 bg-green-100 border-green-300" : "text-red-800 bg-red-100 border-red-300"}`}>
                                        {successMsg}
                                    </div>
                                )}

                                {/* Registration Form */}
                                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-[#6D4C41]" style={{ fontFamily: '"Lora", serif' }}>
                                            Your name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 shadow-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-[#6D4C41]" style={{ fontFamily: '"Lora", serif' }}>
                                            Your email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 shadow-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-bold text-[#6D4C41]" style={{ fontFamily: '"Lora", serif' }}>
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 shadow-sm font-serif focus:outline-none focus:ring-2 focus:ring-[#8D6E63]"
                                            required
                                        />
                                    </div>

                                    {/* Loading Spinner */}
                                    {loading ? (
                                        <div className="flex justify-center mb-4">
                                            <div className="w-8 h-8 border-4 border-[#8D6E63] border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <button type="submit" className="w-full text-white bg-[#8D6E63] border border-[#5D4037] hover:bg-[#5D4037] focus:ring-4 focus:outline-none focus:ring-[#D7CCC8] font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-xl" disabled={loading}>
                                            Create an account
                                        </button>
                                    )}

                                    {/* Link to Login Page */}
                                    <p className="text-sm font-light text-center text-[#6D4C41]">
                                        Already have an account?{" "}
                                        <Link to="/" className="font-medium text-[#8D6E63] hover:underline">
                                            Login here
                                        </Link>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RegisterScreen;