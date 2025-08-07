import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ManualSalesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogQuantity, setDialogQuantity] = useState('1');
  const searchRef = useRef(null);
  const quantityInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (openDialog && quantityInputRef.current) {
      quantityInputRef.current.select();
    }
  }, [openDialog]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(`http://localhost:8080/api/products/search/barcode?prefix=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data);
    } catch {
      toast.error('Error searching products', { position: 'top-right', autoClose: 3000 });
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === '') {
      setSearchResults([]);
    } else {
      handleSearch();
    }
  };

  const handleAddItem = (product) => {
    setSelectedProduct(product);
    setDialogQuantity('1');
    setOpenDialog(true);
  };

  const handleQuantityConfirm = () => {
    const qty = parseInt(dialogQuantity) || 1;
    if (qty < 1) return;
    const existing = selectedItems.find(item => item.productId === selectedProduct.id);
    if (existing) {
      setSelectedItems(prev =>
          prev.map(item =>
              item.productId === selectedProduct.id
                  ? {
                    ...item,
                    quantity: item.quantity + qty,
                    itemTotalAmount: (item.quantity + qty) * selectedProduct.price
                  }
                  : item
          )
      );
    } else {
      setSelectedItems(prev => [...prev, {
        productId: selectedProduct.id,
        quantity: qty,
        itemTotalAmount: selectedProduct.price * qty,
        name: selectedProduct.name,
        price: selectedProduct.price
      }]);
    }
    setQuantity(q => ({ ...q, [selectedProduct.id]: qty }));
    setOpenDialog(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleQuantityInputChange = (e) => {
    setDialogQuantity(e.target.value);
  };

  const handleQuantityKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleQuantityConfirm();
    }
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(prev => prev.filter(i => i.productId !== id));
    setQuantity(q => {
      const copy = { ...q };
      delete copy[id];
      return copy;
    });
  };

  const handleQuantityChange = (id, val) => {
    if (val < 1) return;
    setQuantity(q => ({ ...q, [id]: val }));
    setSelectedItems(prev =>
        prev.map(i =>
            i.productId === id
                ? { ...i, quantity: val, itemTotalAmount: i.price * val }
                : i
        )
    );
  };

  const handleSubmit = async () => {
    if (selectedItems.length === 0) return toast.error('Add at least one item', { position: 'top-right', autoClose: 3000 });
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:8080/api/admin/manual-sales', { items: selectedItems }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Sale created successfully', { position: 'top-right', autoClose: 3000 });
      setSelectedItems([]);
      setQuantity({});
    } catch {
      toast.error('Error creating sale', { position: 'top-right', autoClose: 3000 });
    }
  };

  const totalCost = selectedItems.reduce((sum, item) => sum + item.itemTotalAmount, 0).toFixed(2);

  return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Manual Sales</h1>

          <div className="bg-white shadow-lg rounded-lg p-6 mb-8 relative" ref={searchRef}>
            <div className="flex items-center space-x-2">
              <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by Name or Barcode"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-2 z-10 max-h-96 overflow-y-auto">
                  {searchResults.map(product => (
                      <div
                          key={product.id}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => handleAddItem(product)}
                      >
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500">Barcode: {product.barcode}</p>
                        </div>
                        <button
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add
                        </button>
                      </div>
                  ))}
                </div>
            )}
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Items</h2>
            <div className="divide-y divide-gray-200">
              {selectedItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items selected</p>
              ) : (
                  selectedItems.map(item => (
                      <div key={item.productId} className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)} | Total: ${(item.itemTotalAmount).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                              type="number"
                              min="1"
                              value={quantity[item.productId] || item.quantity}
                              onChange={e => handleQuantityChange(item.productId, parseInt(e.target.value))}
                              className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                  ))
              )}
            </div>
            {selectedItems.length > 0 && (
                <div className="flex justify-end py-4">
                  <p className="text-lg font-semibold text-gray-800">Total Cost: ${totalCost}</p>
                </div>
            )}
            <button
                onClick={handleSubmit}
                disabled={selectedItems.length === 0}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Proceed
            </button>
          </div>

          {openDialog && (
              <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Enter Quantity</h3>
                  <input
                      type="text"
                      value={dialogQuantity}
                      onChange={handleQuantityInputChange}
                      onKeyDown={handleQuantityKeyDown}
                      onFocus={e => e.target.select()}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                      autoFocus
                      ref={quantityInputRef}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setOpenDialog(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleQuantityConfirm}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default ManualSalesPage;