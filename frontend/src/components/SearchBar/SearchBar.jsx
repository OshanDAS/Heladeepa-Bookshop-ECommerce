import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const accessToken = localStorage.getItem('accessToken');
    const resultsRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (query.length >= 3) {
            setIsLoading(true);
            try {
                const res = await axios.get(`http://localhost:8080/api/search?keyword=${query}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });
                setSearchResults(res.data);
                setIsResultsVisible(true);
            } catch (err) {
                console.error("Error fetching search results", err);
            } finally {
                setIsLoading(false);
            }
        } else {
            setSearchResults([]);
            setIsResultsVisible(false);
        }
    };

    // Handle click outside the search results to close them
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                setIsResultsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleResultClick = (productId) => {
        navigate(`/products/${productId}`);
        setIsResultsVisible(false);
        setQuery('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative w-full flex justify-center items-center py-4 px-4 sm:px-6" ref={resultsRef}>
            <div className="flex items-center w-full sm:w-3/4 lg:w-2/3 relative group">
                {/* Search Input */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search for products..."
                        className="w-full p-1.5 sm:p-2 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-xl border-2 border-[#8D6E63] bg-white/90 backdrop-blur-sm focus:outline-none focus:border-[#5D4037] transition-all duration-300 text-[#5D4037] placeholder-[#A1887F] text-sm sm:text-base"
                    />
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#8D6E63]" size={16} />
                    {query && (
                        <button
                            onClick={() => {
                                setQuery('');
                                setSearchResults([]);
                                setIsResultsVisible(false);
                            }}
                            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-[#8D6E63] hover:text-[#5D4037] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="ml-2 sm:ml-3 bg-[#F5E6CA] text-[#5D4037] px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl hover:bg-[#D7CCC8] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-1 sm:space-x-2 shadow-md hover:shadow-lg border-2 border-[#8D6E63]"
                >
                    <Search size={16} className="sm:hidden" />
                    <span className="hidden sm:inline font-medium">Search</span>
                </button>
            </div>

            {/* Search Results Dropdown */}
            {isResultsVisible && (
                <div className="absolute top-full left-0 sm:left-1/4 right-0 sm:right-1/4 mt-2 bg-white rounded-xl shadow-lg border border-[#8D6E63] overflow-hidden z-50 max-h-96 transform transition-all duration-300 ease-in-out">
                    {isLoading ? (
                        <div className="p-4 text-center text-[#8D6E63]">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8D6E63] mx-auto"></div>
                            <p className="mt-2">Searching...</p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <ul className="max-h-96 overflow-y-auto">
                            {searchResults.map((result) => (
                                <li
                                    key={result.id}
                                    onClick={() => handleResultClick(result.id)}
                                    className="p-3 sm:p-4 hover:bg-[#F5E6CA] cursor-pointer transition-colors duration-200 border-b border-[#D7CCC8] last:border-b-0"
                                >
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        {result.imageUrl && (
                                            <img
                                                src={result.imageUrl}
                                                alt={result.name}
                                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-[#5D4037] text-sm sm:text-base truncate">{result.name}</h3>
                                            <p className="text-xs sm:text-sm text-[#8D6E63] line-clamp-2">{result.description}</p>
                                            <p className="text-xs sm:text-sm text-[#8D6E63] font-medium mt-1">Rs. {result.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-[#8D6E63]">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
