import React from 'react';

const StockAlertCard = ({ product }) => {
    return (
        <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-3 rounded-md shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-semibold text-red-700">
                        🔻 Low Stock Alert: <span className="text-black">{product.productName}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                        Stock: <strong>{product.stock}</strong> | Threshold: {product.stockThreshold}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StockAlertCard;