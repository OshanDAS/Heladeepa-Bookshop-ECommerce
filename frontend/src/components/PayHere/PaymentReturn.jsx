import React from 'react';
import { useLocation } from 'react-router-dom';

const PaymentReturn = () => {
    const { state } = useLocation();
    const paymentData = state?.paymentData;

    if (!paymentData) {
        return (
            <div className="text-center mt-20">
                <h2 className="text-2xl font-semibold text-red-500">Oops! No payment data found.</h2>
                <a href="/" className="text-blue-600 underline mt-4 block">Return to Home</a>
            </div>
        );
    }

    const itemNames = paymentData.items.split(',');
    const quantities = paymentData.products.map(p => p.quantity);

    const purchasedItems = itemNames.map((name, index) => ({
        title: name.trim(),
        quantity: quantities[index]
    }));

    return (
        <div className="max-w-3xl mx-auto mt-12 px-4">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    Thank you for your purchase, {paymentData.first_name}!
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                    Your order <span className="font-semibold">{paymentData.order_id}</span> has been successfully completed.
                </p>
                <p className="text-gray-600 mb-6">
                    We'll ship your items to: <br />
                    {paymentData.address}, {paymentData.city} <br />
                    📞 {paymentData.phone} | 📧 {paymentData.email}
                </p>
            </div>

            <h2 className="text-xl font-semibold mb-4">Purchased Items:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-800">
                {purchasedItems.map((item, idx) => (
                    <li key={idx} className="text-lg">
                        {item.title} — Quantity: <span className="font-medium">{item.quantity}</span>
                    </li>
                ))}
            </ul>

            <div className="text-center mt-10">
                <a
                    href="https://heladeepa.store/products"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
                >
                    Return to Shop
                </a>
            </div>
        </div>
    );
};

export default PaymentReturn;
