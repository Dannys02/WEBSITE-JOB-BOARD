import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "seeker" // default role
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    // Update field form secara dinamis tanpa buat handler satu per satu
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/register", form);
            // Langsung login setelah register berhasil
            login(res.data.user, res.data.token);
            // Redirect berdasarkan role yang dipilih
            const role = res.data.user.role;
            if (role === "employer") navigate("/employer/dashboard");
            else navigate("/seeker/dashboard");
        } catch (err) {
            // Ambil pesan error pertama dari Laravel validation
            const errors = err.response?.data?.errors;
            if (errors) {
                const firstError = Object.values(errors)[0][0];
                setError(firstError);
            } else {
                setError(err.response?.data?.message || "Register gagal");
            }
        } finally {
            setLoading(false);
        }
    }
    
    return(
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

</div
    );
}

export default Register;
