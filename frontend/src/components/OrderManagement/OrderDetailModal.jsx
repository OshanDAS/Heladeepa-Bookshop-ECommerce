import React, { useState } from 'react';
import { updateOrderStatus } from '../../api/orderApi';
import { X } from 'lucide-react';

const OrderDetailModal = ({ order, onClose }) => {
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(order.orderId, newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Order Details - {order.orderId}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">Customer Information</p>
            <p>Name: {order.userName}</p>
          </div>

          <div>
            <p className="font-semibold">Order Status</p>
            <p className={`inline-block px-3 py-1 rounded-full text-sm ${
              status === 'Delivered' ? 'bg-green-100 text-green-800' :
              status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
              status === 'Cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {status}
            </p>
          </div>

          <div>
            <p className="font-semibold">Order Summary</p>
            <p>Total Amount: ${order.amount}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="font-semibold">Products</p>
            <div className="mt-2 space-y-2">
              {order.orderProducts.map((product) => (
                <div key={product.productId} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                  </div>
                  <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              onClick={() => handleStatusChange('Shipped')}
              disabled={status === 'Shipped' || status === 'Delivered' || status === 'Cancelled'}
            >
              Mark as Shipped
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={() => handleStatusChange('Delivered')}
              disabled={status === 'Delivered' || status === 'Cancelled'}
            >
              Mark as Delivered
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={() => handleStatusChange('Cancelled')}
              disabled={status === 'Cancelled'}
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal; 