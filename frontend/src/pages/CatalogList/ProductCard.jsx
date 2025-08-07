import React from "react";
import NotifyMeButton from "../../components/Buttons/NotifyMeButton.jsx";
import {useNavigate} from "react-router-dom";
import WishlistHeart from "../../components/Buttons/WishlistHeart.jsx";
import PreOrderButton from "../../components/Buttons/PreOrderButton.jsx";
import PreOrderBadge from "../../components/Badges/PreOrderBadge.jsx";

const ProductCard = ({ product , addToCart , email}) => {
    const navigate = useNavigate();

    // Check if product is available for pre-order
    const isPreOrderAvailable = product.preOrderAvailable && new Date(product.releaseDate) > new Date();
    return(
        <div className="bg-white rounded-xl shadow-lg p-4 transition-transform transform hover:-translate-y-2 hover:shadow-xl h-full min-h-[320px]">
            {/* Book Cover */}
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain rounded-lg" />


                {/* Stock Badge or Pre-order Badge */}
                {isPreOrderAvailable ? (
                    <PreOrderBadge releaseDate={product.releaseDate} />
                ) : (
                    <span className={`absolute top-2 left-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                )}

                <div className="absolute top-2 right-2">
                    <WishlistHeart productId={product.id} email={email} />
                </div>

                {product.stock===0 && !isPreOrderAvailable && (
                    <div className="absolute top-2 right-12"> {/* Moved to make room for heart */}
                        <NotifyMeButton productId={product.id} email={email} isIcon={true} />
                    </div>
                )}
            </div>

            {/* Book Details */}
            <div className="mt-4">
                <h3 className="text-lg font-bold text-[#5D4037]">{product.name}</h3>
                <p className="text-sm text-[#6D4C41] truncate">{product.description}</p>
                <p className="mt-1 text-[#D4A373] font-semibold text-lg">Rs. {product.price.toFixed(2)}</p>

                {/* Show release date for pre-order products */}
                {isPreOrderAvailable && (
                    <p className="text-sm text-amber-600 mt-1">
                        Release Date: {new Date(product.releaseDate).toLocaleDateString()}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex justify-between items-center">

                {isPreOrderAvailable ? (
                    <PreOrderButton productId={product.id} email={email} />
                ) : (
                    <button
                        className="bg-[#8D6E63] text-white px-4 py-2 rounded-lg hover:bg-[#5D4037] transition"
                        disabled={product.stock === 0}
                        onClick={() => addToCart(product.id)}
                    >
                        {product.stock > 0 ? "Add to Cart" : "Sold Out"}
                    </button>
                )}
                <button
                    className="text-[#8D6E63] font-semibold hover:underline"
                    onClick={()=> navigate(`/products/${product.id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
export default ProductCard;