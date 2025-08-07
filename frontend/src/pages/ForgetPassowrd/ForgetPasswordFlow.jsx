import { useState } from "react";
import RequestOTP from "./RequestOTP";
import VerifyOTP from "./VerifyOTP";
import ResetPassword from "./ResetPassword";
import Success from "./Success";
import { motion } from "framer-motion";

const notificationVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: -50, opacity: 0, transition: { duration: 0.5 } },
};

const ForgotPasswordFlow = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [notification, setNotification] = useState({ message: "", type: "", visible: false });

    return (
        <>
            {notification.visible && (
                <motion.div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg max-w-xs md:max-w-md ${notification.type === "error" ? "bg-red-600" : "bg-green-600"} text-white text-center font-medium`}
                    variants={notificationVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {notification.message}
                </motion.div>
            )}

            {step === 1 && (
                <RequestOTP
                    onNext={(email) => {
                        setEmail(email);
                        setStep(2);
                    }}
                    setNotification={setNotification}
                />
            )}
            {step === 2 && (
                <VerifyOTP
                    email={email}
                    onNext={(otp) => {
                        setOtp(otp);
                        setStep(3);
                    }}
                    setNotification={setNotification}
                />
            )}
            {step === 3 && (
                <ResetPassword
                    email={email}
                    otp={otp}
                    onNext={() => setStep(4)}
                    setNotification={setNotification}
                />
            )}
            {step === 4 && <Success />}
        </>
    );
};

export default ForgotPasswordFlow;