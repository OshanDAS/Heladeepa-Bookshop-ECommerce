import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const Success = () => {
    const navigate = useNavigate();

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
                    <div className="p-6 space-y-6 md:space-y-8 sm:p-8 text-center">
                        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>

                        <h1 className="text-2xl font-bold text-[#6D4C41]" style={{ fontFamily: '"Merriweather", serif' }}>
                            Password Reset Successful!
                        </h1>

                        <p className="text-[#5D4037]">
                            You can now login with your new password.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full text-white bg-[#8D6E63] border border-[#5D4037] hover:bg-[#5D4037] focus:ring-4 focus:outline-none focus:ring-[#D7CCC8] font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-xl"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Success;