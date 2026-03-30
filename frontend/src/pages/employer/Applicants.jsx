import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function Applicants() {
    const { id } = useParams(); // job id dari URL
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchApplicants();
    }, [id]);

    async function fetchApplicants() {
        try {
            const res = await api.get(`/employer/jobs/${id}/applicants`);
            setApplicants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // Update status lamaran langsung dari dropdown
    async function handleStatusChange(applicationId, status) {
        try {
            await api.patch(`/employer/applications/${applicationId}/status`, {
                status
            });
            // Update state lokal tanpa fetch ulang
            setApplicants(
                applicants.map(app =>
                    app.id === applicationId ? { ...app, status } : app
                )
            );
            setMessage("Status berhasil diupdate.");
        } catch (err) {
            setMessage("Gagal update status.");
        }
    }

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
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/employer/dashboard")}
                    className="text-blue-600 text-sm mb-6 hover:underline"
                >
                    ← Kembali ke Dashboard
                </button>

                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-xl font-bold mb-6">Daftar Pelamar</h1>

                    {message && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-8 text-gray-400">
                            Memuat...
                        </div>
                    ) : applicants.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            Belum ada pelamar untuk lowongan ini.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applicants.map(app => (
                                <div
                                    key={app.id}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {/* Data pelamar */}
                                            <p className="font-medium text-gray-800">
                                                {app.user?.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {app.user?.email}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Dilamar:{" "}
                                                {new Date(
                                                    app.applied_at
                                                ).toLocaleDateString("id-ID")}
                                            </p>

                                            {/* Link download CV */}
                                            {app.cv_path && (
                                                <a
                                                    href={`http://127.0.0.1:8000/storage/${app.cv_path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                                                >
                                                    📄 Lihat CV
                                                </a>
                                            )}

                                            {/* Cover letter kalau ada */}
                                            {app.cover_letter && (
                                                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                                                    {app.cover_letter}
                                                </p>
                                            )}
                                        </div>

                                        {/* Dropdown update status */}
                                        <div className="flex flex-col items-end gap-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(
                                                    app.status
                                                )}`}
                                            >
                                                {app.status}
                                            </span>
                                            <select
                                                value={app.status}
                                                onChange={e =>
                                                    handleStatusChange(
                                                        app.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="text-xs border rounded px-2 py-1"
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="reviewed">
                                                    Reviewed
                                                </option>
                                                <option value="accepted">
                                                    Accepted
                                                </option>
                                                <option value="rejected">
                                                    Rejected
                                                </option>
                                            </select>
                                        </div>
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

export default Applicants;
