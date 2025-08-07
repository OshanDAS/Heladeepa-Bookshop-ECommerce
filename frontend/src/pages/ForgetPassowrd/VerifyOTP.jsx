import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const VerifyOTP = ({ email, onNext, setNotification }) => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotification({ message: "", type: "", visible: false });

        try {
            const response = await axios.post('http://localhost:8080/api/auth/verify-otp', { email, otp });
            setNotification({
                message: response.data,
                type: "success",
                visible: true
            });
            setTimeout(() => {
                setNotification({ message: "", type: "", visible: false });
                onNext(otp); // Proceed to reset password
            }, 2000);
        } catch (err) {
            setNotification({
                message: "Invalid OTP. Please try again.",
                type: "error",
                visible: true
            });
            setTimeout(() => setNotification({ message: "", type: "", visible: false }), 3000);
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
            <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/images/bookshelf.jpg')` }}></div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-[#6D4C41] to-[#8D6E63] px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-[#3E2723] sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-2xl font-bold text-center text-[#6D4C41]" style={{ fontFamily: '"Merriweather", serif' }}>
                            Verify OTP
                        </h1>
                        <p className="text-center text-[#5D4037]">Enter the 6-digit OTP sent to your email.</p>

                        <form className="space-y-4 md:space-y-6" onSubmit={handleVerify}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-[#6D4C41]">OTP Code</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-[#8D6E63] text-center"
                                    placeholder="Enter 6-digit OTP"
                                    required
                                />
                            </div>

                            {loading ? (
                                <div className="flex justify-center mb-4">
                                    <div className="w-8 h-8 border-4 border-[#8D6E63] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    className="w-full text-white bg-[#8D6E63] border border-[#5D4037] hover:bg-[#5D4037] focus:ring-4 focus:outline-none focus:ring-[#D7CCC8] font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-xl"
                                    disabled={loading}
                                >
                                    Verify OTP
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VerifyOTP;