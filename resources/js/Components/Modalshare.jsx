import { useState } from "react";

export default function ModalShare({ isOpen, onClose, fileName }) {
    const [email, setEmail] = useState("");
    const [people, setPeople] = useState([{ name: "John", role: "Owner" }]);
    const [access, setAccess] = useState("Restricted");

    if (!isOpen) return null;

    const handleAddPerson = (e) => {
        e.preventDefault();
        if (email.trim() !== "") {
            setPeople([...people, { name: email, role: "Viewer" }]);
            setEmail("");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-medium mb-4">
                    Share <span className="font-semibold">“{fileName}”</span>
                </h2>

                <form onSubmit={handleAddPerson} className="mb-4">
                    <input
                        type="text"
                        placeholder="Add people"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </form>

                <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">
                        People with access
                    </h3>
                    <ul className="space-y-1">
                        {people.map((p, idx) => (
                            <li
                                key={idx}
                                className="flex justify-between items-center text-sm border-b pb-1"
                            >
                                <span>{p.name}</span>
                                <span className="text-gray-500">{p.role}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">General access</h3>
                    <select
                        value={access}
                        onChange={(e) => setAccess(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Restricted">Restricted</option>
                        <option value="Public">Public</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
