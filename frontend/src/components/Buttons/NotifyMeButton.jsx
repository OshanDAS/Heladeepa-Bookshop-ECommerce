import { useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const NotifyMeButton = ({ productId, email, isIcon = false }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [subNotifi, setSubNotifi] = useState(false);
    const token = localStorage.getItem("accessToken");

    // Function to handle subscription
    const subscribeForNotification = async () => {
        try {
            await axios.post(
                `http://localhost:8080/api/stock/subscribe?email=${email}&productId=${productId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIsSubscribed(true);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            console.error("Error subscribing for notifications", error);
        }
    };

    const handleSubscribeClick = async () => {
        if (!isSubscribed) {
            await subscribeForNotification();
        } else {
            setSubNotifi(true);
            setTimeout(() => setSubNotifi(false), 3000);
        }
    };

    return (
        <>
            {showNotification && (
                <div className="z-999 fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-opacity duration-300">
                    You will receive an email when this item is available again.
                </div>
            )}
            {subNotifi && (
                <div className="z-50 fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md transition-opacity duration-300">
                    You already subscribed to this product.
                </div>
            )}

            {isIcon ? (
                <button onClick={handleSubscribeClick} className="focus:outline-none">
                    <Bell
                        size={30}
                        className={`transition-all duration-300 ${
                            isSubscribed ? "text-green-500 animate-shake" : "text-gray-500 hover:text-gray-700"
                        }`}
                    />
                </button>
            ) : (
                <button
                    onClick={handleSubscribeClick}
                    className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg w-full md:w-auto"
                >
                    Notify Me
                </button>
            )}

            <style>
                {`
                @keyframes shake {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-10deg); }
                    50% { transform: rotate(10deg); }
                    75% { transform: rotate(-10deg); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out infinite;
                }
                `}
            </style>
        </>
    );
};

export default NotifyMeButton;