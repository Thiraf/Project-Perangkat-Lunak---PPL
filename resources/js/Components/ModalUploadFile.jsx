import { useState } from "react";
import axios from "axios";
import Dropzone from "@/Components/Dropzone";
import AlertMessage from "@/Components/AlertMessage";

export default function ModalNewFile({ isOpen, onClose, onSaved, parentId }) {
    const [fileName, setFileName] = useState("");
    const [labels, setLabels] = useState([]);
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    const handleClose = () => {
        setFileName("");
        setLabels([]);
        setFile(null);
        setInput("");
        setError("");
        setShowError(false);
        onClose();
    };

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("name", fileName || file.name);
        formData.append("type", "file");
        formData.append("file", file);
        if (parentId) {
            formData.append("parent_id", parentId);
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
            console.log("Full server response:", err.response);

            let msg = err.response?.data?.error || err.response?.data?.message || err.message || "Upload failed.";

            console.error(msg); // This should now show your custom message
            setError(msg);
            setShowError(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            e.preventDefault();
            if (!labels.includes(input.trim())) {
                setLabels([...labels, input.trim()]);
            }
            setInput("");
        }
        if (e.key === "Backspace" && input === "" && labels.length > 0) {
            setLabels(labels.slice(0, -1));
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
                <h2 className="text-lg font-semibold mb-4">Upload File</h2>

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
                        placeholder="File Name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Labels
                    </label>
                    <div className="w-full border rounded-md px-2 py-2 flex flex-wrap gap-2">
                        {labels.map((tag, i) => (
                            <span
                                key={i}
                                className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                            >
                                {tag}
                                <button
                                    onClick={() => removeLabel(i)}
                                    className="ml-1 text-blue-500 hover:text-blue-700"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add label..."
                            className="flex-1 min-w-[80px] bg-transparent outline-none text-sm border-none"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        File
                    </label>
                    {file ? (
                        <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-50">
                            <span
                                className="inline-block max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis align-bottom"
                                title={file.name}
                            >
                                {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                                ({Math.round(file.size / 1024)} KB)
                            </span>
                            <button
                                className="ml-auto px-2 py-1 text-xs text-red-600 hover:text-red-800"
                                onClick={() => setFile(null)}
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <Dropzone
                            onDrop={(acceptedFiles) =>
                                setFile(acceptedFiles[0])
                            }
                        />
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                        Maximum upload file size:{" "}
                        <span className="font-semibold">10MB</span>
                    </p>
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
