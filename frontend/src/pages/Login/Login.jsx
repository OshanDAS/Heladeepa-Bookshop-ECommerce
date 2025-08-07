import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ message: "", type: "", visible: false });
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup({ message: "", type: "", visible: false });

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200 && data.accessToken) {
        const accessToken = data.accessToken;
        localStorage.setItem("accessToken", accessToken);

        try {
          const decodedToken = jwtDecode(accessToken);
          const userRole = Array.isArray(decodedToken?.role) ? decodedToken?.role[0] : decodedToken?.role || "USER";
          localStorage.setItem("userRole", userRole);

          setPopup({ message: "Login successful!", type: "success", visible: true });

          // Auto-redirect after 2 seconds
          setTimeout(() => {
            navigate(userRole === "[ADMIN]" ? "/admin/dashboard" : "/products");
          }, 2000);
        } catch (decodeError) {
          setPopup({ message: "Failed to decode token!", type: "error", visible: true });
        }
      } else if(response.status === 401) {
        setPopup({ message: "Invalid email or password!", type: "error", visible: true });
        setError(true);
      }
    } catch (error) {
      setPopup({ message: "An error occurred during login!", type: "error", visible: true });
      setError(true)
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setPopup({ ...popup, visible: false });

    // Add a small delay before navigating
    setTimeout(() => {
      const userRole = localStorage.getItem("userRole");
      console.log("User Role after Modal Close: ", userRole); // Check role after modal

      // Make sure to compare the role as a string (not as an array)
      if (userRole === "[ADMIN]" && !error) {
        navigate("/admin/dashboard");
      } else {
        if (!error){
          navigate("/products");
        }
      }
    }, 300); // Small delay to let the modal close animation finish
  };

  // Smooth transition to Register Page
  const handleRegisterNavigation = (e) => {
    e.preventDefault();
    setTimeout(() => navigate("/register"), 200); // Delayed transition
  };

  return (
      <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen w-screen flex"
      >
        {/* Left Side - Background Image */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/images/bookshelf.jpg')` }}></div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-r from-[#6D4C41] to-[#8D6E63] px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-[#3E2723] sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-2xl font-bold text-center text-[#6D4C41]" style={{ fontFamily: '"Merriweather", serif' }}>
                Log in to your account
              </h1>

              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#6D4C41]">Your email</label>
                  <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-[#8D6E63]"
                      placeholder="name@company.com"
                      required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-[#6D4C41]">Password</label>
                  <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#F5DEB3] border border-[#8B5A2B] text-[#5D4037] text-sm rounded-lg block w-full p-2.5 focus:ring-2 focus:ring-[#8D6E63]"
                      placeholder="••••••••"
                      required
                  />
                </div>

                {/* Forgot Password & Sign Up Links */}
                <div className="flex justify-between text-sm text-[#6D4C41]">
                  <button
                      type="button"
                      onClick={() => navigate("/forget-password")}
                      className="cursor-pointer hover:underline hover:text-[#8D6E63] transition duration-300"
                  >
                    Forgot password?
                  </button>
                  <button
                      type="button"
                      onClick={handleRegisterNavigation}
                      className="cursor-pointer hover:underline hover:text-[#8D6E63] transition duration-300"
                  >
                    Don't have an account? Sign up
                  </button>
                </div>

                {loading ? (
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 border-4 border-[#8D6E63] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <button
                        type="submit"
                        className="w-full text-white bg-[#8D6E63] border border-[#5D4037] hover:bg-[#5D4037] focus:ring-4 focus:outline-none focus:ring-[#D7CCC8] font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-xl"
                        disabled={loading}
                    >
                      Log in
                    </button>
                )}


              </form>
            </div>
          </div>
        </div>

        {/* Popup Modal */}
        {popup.visible && (
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E2723]/50 backdrop-blur-md transition-opacity duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                onClick={closeModal}
            >
              <div
                  className="bg-white text-[#6D4C41] rounded-lg px-6 pt-5 pb-4 shadow-xl transform transition-all scale-95 sm:my-8 sm:max-w-lg sm:w-full"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col items-center">
                  <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${popup.type === "error" ? "bg-[#5D4037]" : "bg-[#8D6E63]"}`}>
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {popup.type === "error" ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      )}
                    </svg>
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium">{popup.type === "error" ? "Error" : "Success"}</h3>
                    <p className="text-sm text-[#5D4037]">{popup.message}</p>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-center">
                  <button className="w-full bg-[#8D6E63] text-white rounded-md px-4 py-2 font-medium hover:bg-[#5D4037]" onClick={closeModal}>
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
        )}
      </motion.div>
  );
};

export default Login;
