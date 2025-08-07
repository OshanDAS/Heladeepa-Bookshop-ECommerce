import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Error403 = () => {
    return (
        <div className="min-h-screen bg-[#F5E6CA] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header Section */}
                <div className="bg-[#8D6E63] p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block p-4 bg-white rounded-full mb-4"
                    >
                        <ShieldAlert size={48} className="text-[#8D6E63]" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-white mb-2">403 - Access Denied</h1>
                    <p className="text-[#D7CCC8] text-lg">
                        Oops! You don't have permission to access this page.
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-8">
                    <div className="space-y-6">
                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                            <h2 className="text-lg font-semibold text-amber-800 mb-2">
                                Why am I seeing this?
                            </h2>
                            <p className="text-amber-700">
                                This error occurs when you try to access a page that requires specific permissions
                                or when your current user role doesn't have access to the requested resource.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#5D4037]">
                                What can you do?
                            </h3>
                            <ul className="space-y-2 text-[#6D4C41]">
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-[#8D6E63] rounded-full"></span>
                                    <span>Check if you're logged in with the correct account</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-[#8D6E63] rounded-full"></span>
                                    <span>Contact support if you believe this is a mistake</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-[#8D6E63] rounded-full"></span>
                                    <span>Return to the homepage or previous page</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="flex items-center justify-center space-x-2 bg-[#8D6E63] text-white px-6 py-3 rounded-lg hover:bg-[#5D4037] transition-colors"
                        >
                            <Home size={20} />
                            <span>Go to Login</span>
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center space-x-2 bg-white border-2 border-[#8D6E63] text-[#8D6E63] px-6 py-3 rounded-lg hover:bg-[#8D6E63] hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Go Back</span>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Error403;
