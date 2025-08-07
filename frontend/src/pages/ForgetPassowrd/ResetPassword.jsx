import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const ResetPassword = ({ email, otp, onNext, setNotification }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setNotification({
                message: 'Passwords do not match',
                type: 'error',
                visible: true
            });
            setTimeout(() => setNotification({ message: "", type: "", visible: false }), 3000);
            return;
        }

        try {
            setLoading(true);
            setNotification({ message: "", type: "", visible: false });

            const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
                email,
                otp,
                "password": newPassword,
            });

            setNotification({
                message: response.data || "Password reset successful!",
                type: 'success',
                visible: true
            });
            setTimeout(() => {
                setNotification({ message: "", type: "", visible: false });
                onNext();
            }, 2000);
        } catch (err) {
            setNotification({
                message: err.response?.data?.message || "Failed to reset password",
                type: 'error',
                visible: true
            });
            setTimeout(() => setNotification({ message: "", type: "", visible: false }), 3000);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        if (password.length === 0) return '';
        if (password.length < 4) return 'Weak';
        if (password.length >= 4 && password.length <= 7) return 'Medium';
        return 'Strong';
    };

    const passwordStrength = getPasswordStrength(newPassword);
    const isPasswordValid = newPassword === confirmPassword && newPassword.length > 0;

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen w-screen flex"
        >
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/images/bookshelf.jpg')` }}></div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-[#6D4C41] to-[#8D6E63] px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-[#3E2723] sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-2xl font-bold text-center text-[#6D4C41]" style={{ fontFamily: '"Merriweather", serif' }}>
                            Reset Password
                        </h1>
                        <p className="text-center text-[#5D4037]">Create a new password for your account</p>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-[#6D4C41]">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-[#8D6E63]"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-[#5D4037]" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-[#5D4037]" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-[#6D4C41]">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-[#8D6E63]"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon className="h-5 w-5 text-[#5D4037]" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5 text-[#5D4037]" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-2">
                                <p className={`text-sm ${
                                    passwordStrength === 'Weak' ? 'text-red-500' :
                                        passwordStrength === 'Medium' ? 'text-yellow-500' :
                                            passwordStrength === 'Strong' ? 'text-green-500' : 'text-[#5D4037]'
                                }`}>
                                    Password Strength: {passwordStrength}
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center mb-4">
                                    <div className="w-8 h-8 border-4 border-[#8D6E63] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className={`w-full text-white ${isPasswordValid ? 'bg-[#8D6E63] hover:bg-[#5D4037]' : 'bg-gray-400 cursor-not-allowed'} border border-[#5D4037] focus:ring-4 focus:outline-none focus:ring-[#D7CCC8] font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 transform hover:scale-105 hover:shadow-xl`}
                                    disabled={!isPasswordValid || loading}
                                >
                                    Reset Password
                                </button>
                            )}
                        </form>

                        <div className="text-center text-sm text-[#6D4C41]">
                            <button
                                onClick={() => navigate("/")}
                                className="hover:underline hover:text-[#8D6E63] transition duration-300"
                            >
                                Back to login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ResetPassword;