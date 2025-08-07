import { useState, useEffect } from "react";
import axios from "axios";
import { Calendar } from 'lucide-react';
import { toast } from "react-toastify";

const PreOrderButton = ({ productId, email }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPreOrdered, setIsPreOrdered] = useState(false);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        // Check if the user has already pre-ordered this product
        const checkPreOrderStatus = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/pre-orders/check?email=${email}&productId=${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setIsPreOrdered(response.data.hasPreOrdered);
            } catch (error) {
                console.error("Error checking pre-order status", error);
            }
        };

        checkPreOrderStatus();
    }, [email, productId, token]);

    const handlePreOrder = async () => {
        if (isPreOrdered) {
            toast.info("You have already pre-ordered this book!");
            return;
        }

        setIsLoading(true);
        try {
            await axios.post(
                `http://localhost:8080/api/pre-orders/create`,
                null,
                {
                    params: { email, productId, quantity: 1 },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIsPreOrdered(true);
            toast.success("Pre-order placed successfully! You'll receive an email confirmation.");
        } catch (error) {
            console.error("Error placing pre-order", error);
            toast.error("Failed to place pre-order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePreOrder}
            disabled={isLoading || isPreOrdered}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition ${
                isPreOrdered
                    ? "bg-[#8D6E63] text-white cursor-not-allowed opacity-70"
                    : "bg-[#8D6E63] text-white hover:bg-[#5D4037]"
            } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
        >
            <Calendar size={16} />
            <span>
                {isLoading ? "Processing..." : isPreOrdered ? "Pre-ordered" : "Pre-order Now"}
            </span>
        </button>
    );
};

export default PreOrderButton;