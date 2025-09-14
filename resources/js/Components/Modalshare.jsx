import { useState, useEffect } from "react";
import axios from "axios";

export default function ModalShare({ isOpen, onClose, itemId, itemName, itemType }) {
    const [email, setEmail] = useState("");
    // Only allow editor permission for folders
    const [permission, setPermission] = useState("viewer");
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [access, setAccess] = useState("Restricted");
    const [confirmRemoveId, setConfirmRemoveId] = useState(null);
    const [editingPermissionId, setEditingPermissionId] = useState(null);
    const [editingPermissionValue, setEditingPermissionValue] = useState("viewer");

    useEffect(() => {
        if (isOpen && itemId) {
            setLoading(true);
            axios.get(`/items/${itemId}/shares`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setPeople(res.data.map(u => ({ name: u.name, role: u.permission, id: u.id })));
                    } else {
                        setPeople([]);
                    }
                })
                .catch(() => setPeople([]))
                .finally(() => setLoading(false));
        }
    }, [isOpen, itemId]);

    if (!isOpen) return null;

    const handleAddPerson = async (e) => {
        e.preventDefault();
        setError("");
        if (email.trim() !== "") {
            try {
                await axios.post(`/items/${itemId}/shares`, {
                    email,
                    permission
                });
                setEmail("");
                setPermission("viewer");
                axios.get(`/items/${itemId}/shares`).then(res => {
                    if (Array.isArray(res.data)) {
                        setPeople(res.data.map(u => ({ name: u.name, role: u.permission, id: u.id })));
                    }
                });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to share item.");
            }
        }
    };

    const handleRemovePerson = async (userId) => {
        setError("");
        try {
            await axios.delete(`/items/${itemId}/shares/${userId}`);
            axios.get(`/items/${itemId}/shares`).then(res => {
                if (Array.isArray(res.data)) {
                    setPeople(res.data.map(u => ({ name: u.name, role: u.permission, id: u.id })));
                }
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove share.");
        }
        setConfirmRemoveId(null);
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 cursor-default"
            onClick={e => { e.stopPropagation(); onClose(); }}
        >
            <div className="bg-white rounded-lg shadow-lg w-96 p-6 cursor-default relative" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">
                        Share <span className="font-semibold inline-block max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis align-bottom" title={itemName}>“{itemName}”</span>
                    </h2>
                    <button
                        className="text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none ml-4"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleAddPerson} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Add people by email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={itemType === "folder" ? "w-2/3 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" : "w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"}
                    />
                    {itemType === "folder" && (
                        <select
                            value={permission}
                            onChange={e => setPermission(e.target.value)}
                            className="w-1/3 border rounded-md px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                        </select>
                    )}
                    <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add</button>
                </form>
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">
                        People with access
                    </h3>
                    {loading ? (
                        <div className="text-gray-500 text-sm">Loading...</div>
                    ) : (
                        <ul className="space-y-1">
                            {people.map((p, idx) => (
                                <li
                                    key={p.id || idx}
                                    className="flex justify-between items-center text-sm border-b pb-1"
                                >
                                    <span className="max-w-[120px] overflow-hidden whitespace-nowrap text-ellipsis" title={p.name}>{p.name}</span>
                                    {p.role !== "Owner" ? (
                                        <>
                                            {itemType === "folder" && editingPermissionId === p.id ? (
                                                <>
                                                    <select
                                                        value={editingPermissionValue}
                                                        onChange={e => setEditingPermissionValue(e.target.value)}
                                                        className="border rounded-md px-2 py-1 text-xs mr-2"
                                                    >
                                                        <option value="viewer">Viewer</option>
                                                        <option value="editor">Editor</option>
                                                    </select>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 text-xs mr-2"
                                                        onClick={async () => {
                                                            try {
                                                                await axios.patch(`/items/${itemId}/shares/${p.id}`, { permission: editingPermissionValue });
                                                                setEditingPermissionId(null);
                                                                axios.get(`/items/${itemId}/shares`).then(res => {
                                                                    if (Array.isArray(res.data)) {
                                                                        setPeople(res.data.map(u => ({ name: u.name, role: u.permission, id: u.id }))); 
                                                                    }
                                                                });
                                                            } catch (err) {
                                                                setError(err.response?.data?.message || "Failed to update permission.");
                                                            }
                                                        }}
                                                    >Save</button>
                                                    <button className="text-gray-500 text-xs" onClick={() => setEditingPermissionId(null)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-gray-500 mr-2">{p.role.charAt(0).toUpperCase() + p.role.slice(1)}</span>
                                                    {/* Only allow permission change for folders */}
                                                    {itemType === "folder" && (
                                                        <button
                                                            className="text-blue-600 hover:text-blue-800 text-xs mr-2"
                                                            onClick={() => { setEditingPermissionId(p.id); setEditingPermissionValue(p.role); }}
                                                        >Change</button>
                                                    )}
                                                </>
                                            )}
                                            <button
                                                className="text-red-500 hover:text-red-700 text-xs"
                                                onClick={() => setConfirmRemoveId(p.id)}
                                            >
                                                Remove
                                            </button>
                                            {confirmRemoveId === p.id && (
                                                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-lg p-4 z-50">
                                                    <div className="mb-2 text-sm">Are you sure you want to remove <span className="font-semibold">{p.name}</span>?</div>
                                                    <div className="flex justify-end gap-2">
                                                        <button className="px-3 py-1 rounded border" onClick={() => setConfirmRemoveId(null)}>Cancel</button>
                                                        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => handleRemovePerson(p.id)}>Remove</button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-gray-500 mr-2">{p.role.charAt(0).toUpperCase() + p.role.slice(1)}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">General access</h3>
                    <select
                        value={access}
                        onChange={(e) => setAccess(e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Restricted">Restricted</option>
                        <option value="Public">Public</option>
                    </select>
                </div> */}

            </div>
        </div>
    );
}
