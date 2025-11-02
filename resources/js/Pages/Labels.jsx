import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import ModalTag from "@/Components/ModalTag";
import LoadingOverlay from "@/Components/LoadingOverlay";
import ModalDelete from "@/Components/Modaldelete";

const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Labels() {
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // simple client-side pagination to match the desired view
    const [page, setPage] = useState(1);
    const pageSize = 13;

    useEffect(() => {
        setLoading(true);
        axios
            .get("/labels")
            .then((res) => setLabels(res.data || []))
            .catch(() => setError("Failed to load labels."))
            .finally(() => setLoading(false));
    }, []);

    const total = labels.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(total, start + pageSize);
    const pageData = useMemo(() => labels.slice(start, end), [labels, start, end]);

    const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

    // modal states
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deletingTag, setDeletingTag] = useState(null);

    const openNew = () => {
        setEditing(null);
        setShowModal(true);
    };
    const openEdit = (tag) => {
        setEditing(tag);
        setShowModal(true);
    };

    const handleSave = async (payload) => {
        setLoading(true);
        try {
            if (payload.id) {
                // Update existing label
                await axios.put(`/labels/${payload.id}`, payload);
            }
            // Refresh the labels list after successful save
            const response = await axios.get("/labels");
            setLabels(response.data || []);
            // reset to first page to see the new item
            setPage(1);
        } catch (err) {
            console.error("Failed to save label:", err);
            setError(err.response?.data?.message || "Failed to save label");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Labels" />
            {loading && <LoadingOverlay />}

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Labels</h2>
                <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                    onClick={openNew}
                >
                    + Add Label
                </button>
            </div>

            <div className="bg-white rounded shadow w-full">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed text-sm border-separate border-spacing-x-6 border-spacing-y-2">
                        <colgroup>
                            <col className="w-16" /> {/* No */}
                            <col className="w-[35%]" /> {/* Name */}
                            <col className="w-[30%]" /> {/* Desc */}
                            <col className="w-[160px]" /> {/* Action */}
                        </colgroup>

                        <thead className="bg-gray-200 text-gray-700">
                            <tr className="[&>th:last-child]:px-6 [&>th:last-child]:text-center">
                                <th className="px-6 py-3 text-left font-medium">
                                    No
                                </th>
                                <th className="px-6 py-3 text-left font-medium">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left font-medium">
                                    Color
                                </th>
                                <th className="px-6 py-3 text-center font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pageData.map((t, idx) => (
                            <tr
                                    key={t.id ?? t.name}
                                    className="even:bg-gray-50 border-t [&>td:last-child]:px-6 [&>td:last-child]:text-center"
                                >
                                    <td className="px-6 py-3 align-middle">
                                        {start + idx + 1}.
                                    </td>
                                    <td className="px-6 py-3 align-middle">
                                        {t.name}
                                    </td>
                                    <td className="px-6 py-3 align-middle break-words">
                                        <span
                                            style={{
                                                backgroundColor: t.color
                                                    ? hexToRgba(t.color, 0.3)
                                                    : "#eee",
                                                color: "#222",
                                                borderRadius: "4px",
                                                padding: "2px 6px",
                                                marginRight: "4px",
                                                fontSize: "0.85em",
                                                display: "inline-block"
                                            }}
                                        >
                                            {t.color}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-center">
                                        <div className="flex justify-center space-x-2 whitespace-nowrap">
                                            <button
                                                className="inline-flex items-center px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                                                onClick={() => openEdit(t)}
                                            >
                                                <Edit className="h-3.5 w-3.5 mr-1" />{" "}
                                                Edit
                                            </button>
                                            <button
                                                className="inline-flex items-center px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                                                onClick={() => {
                                                    setDeletingTag(t);
                                                    setShowDeleteModal(true);
                                                }}
                                            >
                                                <Trash className="h-3.5 w-3.5 mr-1" />{" "}
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* footer: showing entries + simple pagination */}
            <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                <div>
                    Showing {total === 0 ? 0 : start + 1} to {end} of {total}{" "}
                    entries
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        className="px-2 py-1 rounded hover:bg-gray-200"
                        onClick={() => goTo(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const p = i + 1;
                        const active = p === currentPage;
                        return (
                            <button
                                key={p}
                                onClick={() => goTo(p)}
                                className={`px-2 py-1 rounded ${
                                    active ? "bg-gray-300" : "hover:bg-gray-200"
                                }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                    <button
                        className="px-2 py-1 rounded hover:bg-gray-200"
                        onClick={() => goTo(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* Tag Modal */}
            <ModalTag
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                initial={editing}
            />

            {/* Delete Confirmation Modal */}
            <ModalDelete
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletingTag(null);
                }}
                onConfirm={async () => {
                    setLoading(true);
                    try {
                        await axios.delete(`/labels/${deletingTag.id}`);
                        // Refresh the list after successful delete
                        const response = await axios.get("/labels");
                        setLabels(response.data || []);
                        setError("");
                    } catch (err) {
                        console.error("Failed to delete label:", err);
                        setError("Failed to delete label. Please try again.");
                    } finally {
                        setLoading(false);
                        setDeletingTag(null);
                    }
                }}
                itemName={deletingTag?.name}
            />
        </AuthenticatedLayout>
    );
}
