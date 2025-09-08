import { useState } from "react";
import axios from "axios";
import Dropzone from "@/Components/Dropzone";

export default function ModalNewFile({ isOpen, onClose, onSaved }) {
    const [fileName, setFileName] = useState("");
    const [labels, setLabels] = useState([]);
    const [file, setFile] = useState(null);
    const [input, setInput] = useState("");

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("name", fileName || file.name);
        formData.append("type", "file");
        formData.append("file", file);
        // Optionally add parent_id if needed
        try {
            await axios.post("/items", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setFileName("");
            setLabels([]);
            setFile(null);
            setInput("");
            onClose();
            if (onSaved) onSaved();
        } catch (err) {
            alert("Upload failed: " + (err.response?.data?.message || err.message));
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-semibold mb-4">Upload File</h2>

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
                    <Dropzone
                        onDrop={(acceptedFiles) => setFile(acceptedFiles[0])}
                    />
                    {file && (
                        <p className="mt-2 text-sm text-green-600 font-semibold">
                            Selected: {file.name} (
                            {Math.round(file.size / 1024)} KB)
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
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
