import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyPage() {
    const [message, setMessage] = useState("");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:8080/api/users/verify?token=${token}`)
                .then((res) => setMessage(res.data))
                .catch(() => setMessage("Verification failed."));
        }
    }, [token]);

    return <div className="p-4 text-center">{message}</div>;
}