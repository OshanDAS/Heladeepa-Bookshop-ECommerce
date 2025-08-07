
import {useNavigate} from 'react-router-dom';


const PaymentCancel = () => {
    const navigate = useNavigate();


    return (
        <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center border border-red-200">
                <div className="text-red-500 mb-4 text-5xl">❌</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaction Incomplete</h1>
                <p className="text-gray-600 mb-6">
                    Your payment was cancelled or failed. No charges have been made.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => navigate('/cart')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/products')}
                        className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;