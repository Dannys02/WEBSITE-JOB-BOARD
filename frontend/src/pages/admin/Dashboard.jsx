import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchStats();
        fetchJobs();
    }, []);

    async function fetchStats() {
        try {
            const res = await api.get("/admin/stats");
            setStats(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchJobs() {
        try {
            const res = await api.get("/admin/jobs");
            setJobs(res.data.data); // paginated
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteJob(id) {
        if (!confirm("Yakin ingin menghapus lowongan ini?")) return;
        try {
            await api.delete(`/admin/jobs/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
            setMessage("Lowongan berhasil dihapus.");
        } catch (err) {
            setMessage("Gagal menghapus lowongan.");
        }
    }

    async function handleToggleJobStatus(id, currentStatus) {
        const newStatus = currentStatus === "active" ? "closed" : "active";
        try {
            await api.patch(`/admin/jobs/${id}/status`, { status: newStatus });
            setJobs(
                jobs.map(j => (j.id === id ? { ...j, status: newStatus } : j))
            );
            setMessage("Status lowongan berhasil diupdate.");
        } catch (err) {
            setMessage("Gagal update status.");
        }
    }

    async function handleLogout() {
        try {
            await api.post("/logout");
        } catch (err) {
            console.error(err);
        } finally {
            logout();
            navigate("/login");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
                <h1 className="font-bold text-lg text-blue-600">
                    Job Board — Admin
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Halo, {user?.name}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Statistik cards */}
                {stats && (
                    <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
                        {[
                            { label: "Total Users", value: stats.total_users },
                            { label: "Total Jobs", value: stats.total_jobs },
                            {
                                label: "Total Lamaran",
                                value: stats.total_applications
                            },
                            {
                                label: "Lowongan Aktif",
                                value: stats.active_jobs
                            }
                        ].map(s => (
                            <div
                                key={s.label}
                                className="bg-white rounded-lg shadow p-4 text-center"
                            >
                                <p className="text-2xl font-bold text-blue-600">
                                    {s.value}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {message && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                        {message}
                    </div>
                )}

                {/* Tabel semua job */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="font-semibold text-lg mb-4">
                        Moderasi Lowongan
                    </h2>

                    {loading ? (
                        <div className="text-center py-8 text-gray-400">
                            Memuat...
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            Belum ada lowongan.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {jobs.map(job => (
                                <div
                                    key={job.id}
                                    className="border rounded-lg p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {job.title}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {job.company?.name} · {job.location}
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                                                job.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {job.status}
                                        </span>
                                    </div>

                                    {/* Aksi admin */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleToggleJobStatus(
                                                    job.id,
                                                    job.status
                                                )
                                            }
                                            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                                        >
                                            {job.status === "active"
                                                ? "Tutup"
                                                : "Aktifkan"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteJob(job.id)
                                            }
                                            className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
