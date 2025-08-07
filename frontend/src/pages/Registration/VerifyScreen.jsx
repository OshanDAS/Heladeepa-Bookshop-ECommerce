import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const VerifyScreen = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Ensure state structure remains consistent
    const [status, setStatus] = useState({ message: "", error: "", loading: false });
    const [email, setEmail] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        const emailParam = searchParams.get("email");
        if (emailParam) setEmail(emailParam);

        if (!token) {
            setStatus({ message: "", error: "Invalid verification token.", loading: false });
            return;
        }

        // ✅ Use async function correctly inside useEffect
        const verifyToken = async () => {
            setStatus((prev) => ({ ...prev, message: "", error: "", loading: true }));

            try {
                const response = await axios.get(`${API_URL}/auth/verify?token=${token}`);
                setStatus((prev) => ({ ...prev, message: response.data, error: "", loading: false }));

                setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                setStatus((prev) => ({
                    ...prev,
                    message: "",
                    error: err.response?.data || "Verification failed.",
                    loading: false,
                }));
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    const handleResend = async () => {
        if (!email) {
            alert("Email not found in query params.");
            return;
        }

        try {
            setStatus((prev) => ({ ...prev, loading: true }));
            const response = await axios.post(`${API_URL}/auth/resendVerification`, { email });
            alert(response.data || "Verification email resent.");
        } catch (err) {
            alert(err.response?.data || "Failed to resend verification email.");
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Helmet>
                <title>Account Verification - Heladeepa Bookshop</title>
                <meta name="description" content="Please verify your account to proceed with the login." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta charSet="UTF-8" />
            </Helmet>

            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg text-center">
                {status.message ? (
                    <>
                        <CheckCircle className="text-green-500 mx-auto mb-3" size={48} />
                        <p className="text-green-700 text-lg font-semibold">{status.message}</p>
                        <p className="text-blue-600 text-sm mt-3">Redirecting to login...</p>
                    </>
                ) : status.error ? (
                    <>
                        <XCircle className="text-red-500 mx-auto mb-3" size={48} />
                        <p className="text-red-700 text-lg font-semibold">{status.error}</p>
                        <button
                            onClick={handleResend}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                            disabled={status.loading}
                        >
                            {status.loading ? (
                                <>
                                    <RefreshCcw size={16} className="animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                <>
                                    <RefreshCcw size={16} />
                                    Resend Verification Email
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    status.loading && <p className="text-blue-600 text-sm">Please wait...</p>
                )}
            </div>
        </div>
    );
};

export default VerifyScreen;
