import './App.css';

import RequestOTP from "./pages/ForgetPassowrd/RequestOTP.jsx";
import VerifyOTP from "./pages/ForgetPassowrd/VerifyOTP.jsx";
import ResetPassword from "./pages/ForgetPassowrd/ResetPassword.jsx";
import Success from "./pages/ForgetPassowrd/Success.jsx";
import ForgetPasswordFlow from "./pages/ForgetPassowrd/ForgetPasswordFlow.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import OrderHistory from './pages/Customer/OrderHistory';


// Import Toastify package
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

function App() {
    return (
        <>
            {/* Add ToastContainer to display notifications globally */}
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                className="z-50"
            />

            {/* Main routes of the app */}
            <AppRoutes />
        </>
    );
}

export default App;