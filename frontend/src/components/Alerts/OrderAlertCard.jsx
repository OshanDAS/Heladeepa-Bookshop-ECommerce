import React from 'react';

const OrderAlertCard = ({ order }) => {
    return (
        <div className="border-l-4 border-blue-500 bg-blue-50 p-4 mb-3 rounded-md shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        🛒 New Order Placed: <span className="text-black">#{order.orderId}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                        Customer: {order.customerName} | Date: {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderAlertCard;