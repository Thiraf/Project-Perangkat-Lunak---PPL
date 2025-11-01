import { useEffect, useState } from "react";
import AlertMessage from "@/Components/AlertMessage";

export default function ModalTag({ isOpen, onClose, onSave, initial }) {
    const isEdit = Boolean(initial);

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const resetForm = () => {
        setName("");
        setDesc("");
        setError("");
        setShowError(false);
    };

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    useEffect(() => {
        if (!isOpen) return;
        setName(initial?.name || "");
        setDesc(initial?.description || "");
        setError("");
        setShowError(false);

        const onKey = (e) => {
            if (e.key === "Escape") handleClose();
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, initial]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) {
            setError("Nama tag wajib diisi.");
            setShowError(true);
            return;
        }
        onSave?.({
            id: initial?.id,
            name: name.trim(),
            description: desc.trim(),
        });
        handleClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-96 p-6"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tag-modal-title"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 id="tag-modal-title" className="text-lg font-semibold">
                        {isEdit ? "Edit Tag" : "New Tag"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Error Alert */}
                <AlertMessage
                    message={error}
                    type="error"
                    show={showError}
                    onClose={() => setShowError(false)}
                />

                {/* Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Name Tag
                    </label>
                    <input
                        type="text"
                        placeholder="Data Stok Jan"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Desc */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Desc
                    </label>
                    <input
                        type="text"
                        placeholder="Data Tahun 2025"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="mr-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                        disabled={!name.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
