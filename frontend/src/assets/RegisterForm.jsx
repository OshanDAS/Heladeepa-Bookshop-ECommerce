import { useState } from "react";
import axios from "axios";

export default function RegisterForm() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/api/users/register", formData);
            setMessage(response.data);
        } catch (error) {
            setMessage("Registration failed.");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-xl mb-4">Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" type="text" onChange={handleChange} className="block w-full mb-2 p-2 border" placeholder="Name" />
                <input name="email" type="email" onChange={handleChange} className="block w-full mb-2 p-2 border" placeholder="Email" />
                <input name="password" type="password" onChange={handleChange} className="block w-full mb-4 p-2 border" placeholder="Password" />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
            </form>
            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        </div>
    );
}