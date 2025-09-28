import { useState, useEffect } from "react";
import axios from "axios";
import AlertMessage from "@/Components/AlertMessage";

export default function ModalNewFolder({ isOpen, onClose, onSaved, parentId }) {
    const [folderName, setFolderName] = useState("");
    const [labels, setLabels] = useState([]); // selected labels
    const [allLabels, setAllLabels] = useState([]); // all labels from db
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleClose = () => {
        setFolderName("");
        setLabels([]);
        setError("");
        setShowError(false);
        onClose();
    };

    // Fetch labels from backend when modal opens
    useEffect(() => {
        if (!isOpen) return;
        axios.get("/labels")
            .then(res => {
                setAllLabels(res.data);
            })
            .catch(() => setAllLabels([]));
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!folderName.trim()) return;
        const formData = new FormData();
        formData.append("name", folderName.trim());
        formData.append("type", "folder");
        if (parentId) {
            formData.append("parent_id", parentId);
        }
        if (labels.length > 0) {
            labels.forEach((label) => {
                formData.append("labels[]", label.id);
            });
        }
        try {
            await axios.post("/items", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            handleClose();
            if (onSaved) onSaved();
        } catch (err) {
            let msg =
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                "Failed to create new folder.";
            setError(msg);
            setShowError(true);
        }
    };

    const handleLabelSelect = (e) => {
        const selectedId = parseInt(e.target.value);
        if (!selectedId) return;
        const found = allLabels.find((l) => l.id === selectedId);
        if (found && !labels.some((l) => l.id === found.id)) {
            setLabels([...labels, found]);
        }
    };

    const removeLabel = (index) => {
        setLabels(labels.filter((_, i) => i !== index));
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-lg shadow-lg w-96 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4">New Folder</h2>

                {/* Error Alert */}
                <AlertMessage
                    message={error}
                    type="error"
                    show={showError}
                    onClose={() => setShowError(false)}
                />

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Folder Name"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Labels
                    </label>
                    <div className="w-full border rounded-md px-2 py-2 flex flex-wrap gap-2">
                        {labels.map((label, i) => (
                            <span
                                key={label.id}
                                className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                            >
                                {label.name}
                                <button
                                    onClick={() => removeLabel(i)}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                        <select
                            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm border-none"
                            onChange={handleLabelSelect}
                            value=""
                        >
                            <option value="">Add label...</option>
                            {allLabels.filter(l => !labels.some(sel => sel.id === l.id)).map((label) => (
                                <option key={label.id} value={label.id}>{label.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleClose}
                        className="mr-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
