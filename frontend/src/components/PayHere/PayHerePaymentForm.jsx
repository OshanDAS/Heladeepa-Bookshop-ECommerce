import { useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const PayHerePaymentForm = () => {
    const { state } = useLocation();
    const paymentData = state?.paymentData;
    const navigate = useNavigate();

    useEffect(() => {
        if (!paymentData) {
            console.error("Payment data is not available");
            return;
        }

        const script = document.createElement("script");
        script.src = "https://www.payhere.lk/lib/payhere.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.payhere.onCompleted = function (orderId) {
                console.log("Payment Completed: " + orderId);
                navigate(`/status?order_id=${orderId}`);
            };

            window.payhere.onError = function (orderId) {
                console.error("Payment Error");
                navigate(`/status?order_id=${orderId}`);
            };

            window.payhere.onDismissed = function () {
                console.log("Payment Dismissed");
                navigate(`/cart`);
            };
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [paymentData, navigate]);

    const handlePayment = async () => {
        if (!paymentData) {
            console.error("No payment data available");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/payhere/create-payment",
                paymentData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            console.log(response.data);
            window.payhere.startPayment(response.data);
        } catch (err) {
            console.error("Payment initiation failed:", err);
        }
    };

    // Split the items string into an array of item names
    const items = paymentData?.items ? paymentData.items.split(",") : [];
    // Map over products to combine them with items and quantities
    const products = paymentData?.products || [];

    return (
        <div className="p-6 bg-gray-100 min-h-screen text-center flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h2>

            {paymentData ? (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                    <p className="text-lg font-semibold text-gray-600 mb-4">Order ID: <span className="font-bold text-blue-600">{paymentData.order_id}</span></p>
                    <p className="text-lg text-gray-600 mb-4">Total Amount: <span className="font-bold text-green-600">${paymentData.amount}</span></p>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Items:</h3>
                        <ul className="space-y-4">
                            {items.map((item, index) => {
                                const product = products[index];
                                const quantity = product?.quantity || 1; // Default to 1 if no quantity is specified
                                return (
                                    <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <div>
                                            <p className="text-gray-800 font-medium">{item}</p>
                                            <p className="text-gray-600">Quantity: {quantity}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Info:</h3>
                        <p className="text-gray-600">Name: <span className="font-bold text-gray-800">{paymentData.first_name} {paymentData.last_name}</span></p>
                        <p className="text-gray-600">Phone: <span className="font-bold text-gray-800">{paymentData.phone}</span></p>
                        <p className="text-gray-600">Email: <span className="font-bold text-gray-800">{paymentData.email}</span></p>
                        <p className="text-gray-600">Address: <span className="font-bold text-gray-800">{paymentData.address}, {paymentData.city}</span></p>
                    </div>

                    <button
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
                        onClick={handlePayment}
                    >
                        Pay Now
                    </button>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <p className="text-red-600 text-lg">No payment data available. Please return to the cart.</p>
                </div>
            )}
        </div>
    );
};

export default PayHerePaymentForm;
