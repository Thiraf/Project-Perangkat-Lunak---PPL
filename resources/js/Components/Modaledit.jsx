import { useState, useEffect } from "react";

export default function ModalEdit({ isOpen, onClose, initialName, onSave }) {
    const [newName, setNewName] = useState(initialName || "");

    useEffect(() => {
        setNewName(initialName || "");
    }, [initialName]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (newName.trim() !== "") {
            onSave(newName);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-semibold mb-4">Edit Name</h2>

                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
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
