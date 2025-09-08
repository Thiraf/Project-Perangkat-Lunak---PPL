import { useState, useRef, useEffect } from "react";
import { MoreVertical, Share2, Edit, Trash } from "lucide-react";
import ModalShare from "./ModalShare";
import ModalEdit from "./ModalEdit";
import ModalDelete from "./ModalDelete";

export default function ActionMenu({ name, onRename, onDelete }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen((prev) => !prev);
                }}
                className="p-1 rounded hover:bg-gray-200"
            >
                <MoreVertical size={18} />
            </button>

            {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border z-10">
                    <button
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                            setShareOpen(true);
                            setMenuOpen(false);
                        }}
                    >
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </button>
                    <button
                        className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                            setEditOpen(true);
                            setMenuOpen(false);
                        }}
                    >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </button>
                    <button
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        onClick={() => {
                            setDeleteOpen(true);
                            setMenuOpen(false);
                        }}
                    >
                        <Trash className="w-4 h-4 mr-2" /> Delete
                    </button>
                </div>
            )}

            <ModalShare
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)}
                fileName={name}
            />

            <ModalEdit
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                initialName={name}
                onSave={(newName) => {
                    if (onRename) onRename(newName);
                }}
            />

            <ModalDelete
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                name={name}
                onConfirm={() => {
                    if (onDelete) onDelete(name);
                }}
            />
        </div>
    );
}
