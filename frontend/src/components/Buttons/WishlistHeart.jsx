import { useState, useEffect } from "react";
import axios from "axios";
import { Heart } from "lucide-react";

const WishlistHeart = ({ productId, email }) => {
    const [inWishlist, setInWishlist] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        // Check if the product is already in the wishlist
        const checkWishlistStatus = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/wishlist/contains?email=${email}&productId=${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setInWishlist(response.data);
                console.log(response);
            } catch (error) {
                console.error("Error checking wishlist status", error);
            }
        };

        checkWishlistStatus();
    }, [email, productId]);

    // Separate function for adding to the wishlist
    const addToWishlist = async () => {
        try {
            await axios.post(
                `http://localhost:8080/api/wishlist/add?email=${email}&productId=${productId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInWishlist(true);
            console.log("Added to wishlist");
        } catch (error) {
            console.error("Error adding to wishlist", error);
        }
    };

    // Separate function for removing from the wishlist
    const removeFromWishlist = async () => {
        try {
            await axios.delete(
                `http://localhost:8080/api/wishlist/remove?email=${email}&productId=${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInWishlist(false);
            console.log("Removed from wishlist");
        } catch (error) {
            console.error("Error removing from wishlist", error);
        }
    };

    // Function to handle toggle action
    const handleToggleWishlist = async () => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        if (inWishlist) {
            await removeFromWishlist();
        } else {
            await addToWishlist();
        }
    };

    return (
        <button onClick={handleToggleWishlist} className="focus:outline-none">
            <Heart
                size={30}
                className={`transition-all duration-300 ${
                    isAnimating ? "scale-125" : "scale-100"
                } ${inWishlist ? "fill-red-500 text-red-500" : "text-[#5D4037] hover:text-[#8D6E63]"}`}
            />
        </button>
    );
};

export default WishlistHeart;
