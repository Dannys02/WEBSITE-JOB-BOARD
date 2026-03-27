import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function SeekerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            const res = await api.get("/seeker/applications");
            setApplications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        try {
            await api.post("/logout");
        } catch (err) {
            console.error(err);
        } finally {
            // Logout tetap dijalankan meski request gagal
            logout();
            navigate("/login");
        }
    }

    // Warna badge berbeda per status lamaran
    function statusColor(status) {
        const colors = {
            pending: "bg-yellow-100 text-yellow-700",
            reviewed: "bg-blue-100 text-blue-700",
            accepted: "bg-green-100 text-green-700",
            rejected: "bg-red-100 text-red-700"
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="font-bold text-lg text-blue-600">Job Board</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Halo, {user?.name}
                    </span>
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-500 hover:text-blue-600"
                    >
                        Cari Kerja
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Ringkasan */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="font-semibold text-lg mb-1">
                        Dashboard Saya
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Total lamaran:{" "}
                        <span className="font-medium text-gray-800">
                            {applications.length}
                        </span>
                    </p>
                </div>

                {/* Tabel riwayat lamaran */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">
                        Riwayat Lamaran
                    </h2>

                    {loading ? (
                        <div className="text-center py-8 text-gray-400">
                            Memuat...
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            Belum ada lamaran.{" "}
                            <a
                                href="/"
                                className="text-blue-600 hover:underline"
                            >
                                Cari lowongan
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {applications.map(app => (
                                <div
                                    key={app.id}
                                    className="border rounded-lg p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {app.job?.title}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {app.job?.company?.name} ·{" "}
                                            {app.job?.location}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Dilamar:{" "}
                                            {new Date(
                                                app.applied_at
                                            ).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>

                                    {/* Badge status */}
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor(
                                            app.status
                                        )}`}
                                    >
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SeekerDashboard;
