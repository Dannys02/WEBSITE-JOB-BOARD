import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Komponen pembungkus untuk halaman yang butuh login
// Kalau belum login, redirect ke /login
// Kalau sudah login tapi role tidak sesuai, redirect ke /
function PrivateRoute({ children, role }) {
    const { user, loading } = useAuth();

    // Tunggu sampai AuthContext selesai cek token
    if (loading) return <div>Loading...</div>;

    // Belum login sama sekali
    if (!user) return <Navigate to="/login" />;

    // Sudah login tapi role tidak sesuai
    // Contoh: seeker coba akses halaman employer
    if (role && user.role !== role) return <Navigate to="/" />;

    // Lolos semua pengecekan, tampilkan halaman
    return children;
}

export default PrivateRoute;
