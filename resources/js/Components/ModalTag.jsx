import { useEffect, useState } from "react";
import AlertMessage from "@/Components/AlertMessage";
import axios from "axios";

const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ModalTag({ isOpen, onClose, onSave, initial }) {
    const isEdit = Boolean(initial);

    const [name, setName] = useState("");
    const [color, setColor] = useState("#F05A27");
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const resetForm = () => {
        setName("");
        setColor("#F05A27");
        setError("");
        setShowError(false);
    };

    const handleClose = () => {
        resetForm();
        onClose?.();
    };

    useEffect(() => {
        if (!isOpen) return;
        // When editing, use the initial values, otherwise use defaults
        setName(isEdit ? initial?.name || "" : "");
        setColor(isEdit ? initial?.color || "#F05A27" : "#F05A27");
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

    const handleSave = async () => {
        if (!name.trim()) {
            setError("Nama tag wajib diisi.");
            setShowError(true);
            return;
        }
        
        const tagData = {
            name: name.trim(),
            color: color,
        };

        try {
            if (isEdit && initial?.id) {
                // Update existing label
                await axios.put(`/labels/${initial.id}`, tagData);
            } else {
                // Create new label
                await axios.post('/labels', tagData);
            }
            
            onSave?.(tagData);
            handleClose();
        } catch (err) {
            const message = err.response?.data?.message || "Failed to save label";
            setError(message);
            setShowError(true);
        }
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

                {/* Color */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">
                        Color
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-12 h-10 p-0 border-0 rounded cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
                            style={{ minWidth: '0px' }}
                        />
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="flex-1 border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                            placeholder="#000000"
                        />
                    </div>
                    <div className="mt-2 w-full">
                        <span
                            className="block w-full py-2 px-4 rounded text-center"
                            style={{
                                backgroundColor: color ? hexToRgba(color, 0.3) : "#eee",
                                color: "#222",
                                border: `1px solid ${color}`
                            }}
                        >
                            Label Preview
                        </span>
                    </div>
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
