import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentStatusPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const order_id = queryParams.get("order_id");

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/payhere/status/${order_id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    }
                });
                setStatus(response.data.status);
            } catch (error) {
                console.error("Failed to fetch payment status:", error);
                setStatus("UNKNOWN");
            } finally {
                setLoading(false);
            }
        };

        if (order_id) {
            fetchStatus();
        } else {
            setStatus("UNKNOWN");
            setLoading(false);
        }
    }, [order_id]);

    if (loading) return <div className="p-6 text-center text-xl">Checking payment status...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
                <h2 className="text-3xl font-semibold mb-6">Payment Status</h2>

                {status === "Paid" && (
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-green-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-green-600 text-lg font-semibold">Payment Successful! 🎉</p>
                        <p className="text-gray-500">Your payment has been processed successfully.</p>
                    </div>
                )}

                {status === "Payment Failed" && (
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <p className="text-red-600 text-lg font-semibold">Payment Failed.</p>
                        <p className="text-gray-500">Something went wrong with your payment. Please try again.</p>
                    </div>
                )}

                {status === "UNKNOWN" && (
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3m3 0h3M12 9v3m0 3v3m0 0l-3 3m3-3l3 3" />
                        </svg>
                        <p className="text-gray-600 text-lg font-semibold">Payment Status Unknown.</p>
                        <p className="text-gray-500">We couldn't verify the payment status. Please check back later or contact support.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentStatusPage;
