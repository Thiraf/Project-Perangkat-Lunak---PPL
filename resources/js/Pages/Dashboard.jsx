import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import CustomSelect from "@/Components/CustomSelect";
import Dropzone from "@/Components/Dropzone";
import ModalNewFolder from "@/Components/Modalnewfolder";
import ModalUploadFile from "@/Components/Modaluploadfile";
import FolderCard from "@/Components/FolderCard";
import FileRow from "@/Components/FileRow";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Dashboard({ auth }) {
    const [label, setLabel] = useState("");
    const [type, setType] = useState("");
    const [filter, setFilter] = useState("");
    const [newItem, setNewItem] = useState("");

    const [showModalNewFolder, setshowModalNewFolder] = useState(false);
    const [showModalUploadFile, setShowModalUploadFile] = useState(false);

    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        if (newItem === "newfolder") {
            setshowModalNewFolder(true);
            setNewItem("");
        } else if (newItem === "fileupload") {
            setShowModalUploadFile(true);
            setNewItem("");
        }
    }, [newItem]);

    useEffect(() => {
        axios.get("/items")
            .then((res) => {
                const items = res.data;
                setFolders(items.filter((item) => item.type === "folder"));
                setFiles(items.filter((item) => item.type === "file"));
            })
            .catch((err) => {
                console.error("Failed to fetch items:", err);
            });
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <h2 className="text-4xl font-semibold">Document</h2>

            <div className="mt-6">
                <div className="mt-4 flex items-center">
                    <div className="flex space-x-2">
                        <CustomSelect
                            label="Choose label"
                            value={label}
                            onChange={setLabel}
                            options={[{ value: "memo", label: "Memo" }]}
                        />

                        <CustomSelect
                            label="Type"
                            value={type}
                            onChange={setType}
                            options={[
                                {
                                    value: "docx",
                                    label: "DOCX",
                                    image: "/images/docx.png",
                                },
                                {
                                    value: "csv",
                                    label: "CSV",
                                    image: "/images/csv.png",
                                },
                                {
                                    value: "pptx",
                                    label: "PPTX",
                                    image: "/images/pptx.png",
                                },
                                {
                                    value: "pdf",
                                    label: "PDF",
                                    image: "/images/pdf.png",
                                },
                            ]}
                        />

                        <CustomSelect
                            label="Filter"
                            value={filter}
                            onChange={setFilter}
                            options={[
                                { value: "project", label: "Project" },
                                { value: "subproject", label: "Sub-Project" },
                            ]}
                        />
                    </div>

                    <div className="ml-auto">
                        <CustomSelect
                            label="+ Add New"
                            primary
                            value={newItem}
                            onChange={setNewItem}
                            options={[
                                {
                                    value: "newfolder",
                                    label: "New Folder",
                                    image: "/images/newfolder.png",
                                },
                                {
                                    value: "fileupload",
                                    label: "File Upload",
                                    image: "/images/fileupload.png",
                                },
                                {
                                    value: "folderupload",
                                    label: "Folder Upload",
                                    image: "/images/folderupload.png",
                                },
                                {
                                    value: "docx",
                                    label: "DOCX",
                                    image: "/images/docx.png",
                                },
                                {
                                    value: "csv",
                                    label: "CSV",
                                    image: "/images/csv.png",
                                },
                                {
                                    value: "pptx",
                                    label: "PPTX",
                                    image: "/images/pptx.png",
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Folders</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {folders.map((folder) => (
                        <FolderCard 
                            id={folder.id} 
                            name={folder.name}
                            onDelete={() => {
                                axios.get("/items")
                                    .then((res) => {
                                        const items = res.data;
                                        setFolders(items.filter((item) => item.type === "folder"));
                                        setFiles(items.filter((item) => item.type === "file"));
                                    });
                            }}
                            onRename={() => {
                                axios.get("/items")
                                    .then((res) => {
                                        const items = res.data;
                                        setFolders(items.filter((item) => item.type === "folder"));
                                        setFiles(items.filter((item) => item.type === "file"));
                                    });
                            }} 
                        />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Files</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Owner</th>
                            <th className="py-2 px-3 cursor-pointer select-none" onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}>Last Modified {sortOrder === "desc" ? <ChevronDown className="inline w-4 h-4" /> : <ChevronUp className="inline w-4 h-4" />}</th>
                            <th className="py-2 px-3">File Size</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...files]
                            .sort((a, b) => {
                                const dateA = new Date(a.updated_at || a.created_at);
                                const dateB = new Date(b.updated_at || b.created_at);
                                return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
                            })
                            .map((file) => {
                                const isMe = file.owner_id === auth.user.id;
                                const ownerName = isMe ? "me" : (file.owner_name || `User ${file.owner_id}`);
                                const fileDate = dayjs(file.updated_at || file.created_at);
                                let modifiedDisplay;
                                if (fileDate.isSame(dayjs(), 'day')) {
                                    modifiedDisplay = `${fileDate.format('h:mm A')} ${ownerName}`;
                                } else {
                                    modifiedDisplay = `${fileDate.format('MMM DD, YYYY')} ${ownerName}`;
                                }
                                return (
                                    <FileRow
                                        id={file.id}
                                        name={file.name}
                                        type={file.mime_type ? file.mime_type.split('/')[1] : ''}
                                        owner={ownerName}
                                        modified={modifiedDisplay}
                                        size={file.size ? `${Math.round(file.size / 1024)} KB` : ''}
                                        path={file.path}
                                        onDelete={() => {
                                            axios.get("/items")
                                                .then((res) => {
                                                    const items = res.data;
                                                    setFolders(items.filter((item) => item.type === "folder"));
                                                    setFiles(items.filter((item) => item.type === "file"));
                                                });
                                        }}
                                        onRename={() => {
                                            axios.get("/items")
                                                .then((res) => {
                                                    const items = res.data;
                                                    setFolders(items.filter((item) => item.type === "folder"));
                                                    setFiles(items.filter((item) => item.type === "file"));
                                                });
                                        }}
                                    />
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* Modal Folder */}
            <ModalNewFolder
                isOpen={showModalNewFolder}
                onClose={() => setshowModalNewFolder(false)}
                onSaved={() => {
                    axios.get("/items")
                        .then((res) => {
                            const items = res.data;
                            setFolders(items.filter((item) => item.type === "folder"));
                            setFiles(items.filter((item) => item.type === "file"));
                        });
                }}
            />

            {/* Modal Upload File */}
            <ModalUploadFile
                isOpen={showModalUploadFile}
                onClose={() => setShowModalUploadFile(false)}
                onSaved={() => {
                    axios.get("/items")
                        .then((res) => {
                            const items = res.data;
                            setFolders(items.filter((item) => item.type === "folder"));
                            setFiles(items.filter((item) => item.type === "file"));
                        });
                }}
            />
        </AuthenticatedLayout>
    );
}
