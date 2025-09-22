import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import CustomSelect from "@/Components/CustomSelect";
import ModalNewFolder from "@/Components/ModalNewfolder";
import ModalUploadFile from "@/Components/ModalUploadfile";
import FolderCard from "@/Components/FolderCard";
import FileRow from "@/Components/FileRow";
import AlertMessage from "@/Components/AlertMessage";
import LoadingOverlay from "@/Components/LoadingOverlay";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewModal from "@/Components/PreviewModal";

export default function FolderView({ auth, folder, items, breadcrumb }) {
    const [label, setLabel] = useState("");
    const [type, setType] = useState("");
    const [filter, setFilter] = useState("");
    const [newItem, setNewItem] = useState("");

    const [showModalNewFolder, setshowModalNewFolder] = useState(false);
    const [showModalUploadFile, setShowModalUploadFile] = useState(false);

    const [sortOrder, setSortOrder] = useState("desc");
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "success",
    });
    const [previewFile, setPreviewFile] = useState(null);

    const [folders, setFolders] = useState(
        items.filter((item) => item.type === "folder")
    );
    const [files, setFiles] = useState(
        items.filter((item) => item.type === "file")
    );

    const canAddNew =
        folder.owner_id === auth.user.id || folder.permission === "editor";

    const fetchItems = useCallback(
        (alertMsg = null) => {
            setIsLoading(true);
            axios
                .get("/items", { params: { parent_id: folder.id } })
                .then((res) => {
                    const items = res.data;
                    setFolders(items.filter((item) => item.type === "folder"));
                    setFiles(items.filter((item) => item.type === "file"));
                    if (alertMsg) {
                        setAlert({
                            show: true,
                            message: alertMsg,
                            type: "success",
                        });
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch items:", err);
                    setAlert({
                        show: true,
                        message: "An error occurred.",
                        type: "error",
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [folder.id]
    );

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
        setFolders(items.filter((item) => item.type === "folder"));
        setFiles(items.filter((item) => item.type === "file"));
    }, [items]);

    const handleItemClick = (item) => {
        if (item.type === "folder") {
            window.location.href = `/${auth.user.id}/folders/${item.id}`;
            return;
        }
        setIsLoading(true);
        axios
            .get(route("items.show", { id: item.id }))
            .then((response) => {
                setPreviewFile(response.data);
            })
            .catch((error) => {
                console.error("Error fetching file details:", error);
                alert("Could not load file for preview.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleBreadcrumbClick = (crumb, idx) => {
        if (crumb.id === null) {
            window.location.href = "/dashboard";
        } else {
            window.location.href = `/${auth.user.id}/folders/${crumb.id}`;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`${folder.name}`} />
            {isLoading && <LoadingOverlay />}
            <AlertMessage
                show={alert.show}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            <h2 className="text-4xl font-semibold">{folder.name}</h2>

            {/* Breadcrumb */}
            <div className="mt-4">
                <nav className="mb-4 flex items-center text-gray-600 text-sm">
                    <span className="flex items-center">
                        <button
                            className={`hover:underline ${
                                breadcrumb.length === 0
                                    ? "font-bold text-black"
                                    : ""
                            }`}
                            onClick={() =>
                                handleBreadcrumbClick(
                                    { id: null, name: "Dashboard" },
                                    0
                                )
                            }
                            disabled={false}
                        >
                            Dashboard
                        </button>
                        {breadcrumb.length > 0 && (
                            <span className="mx-2">/</span>
                        )}
                    </span>
                    {breadcrumb.map((crumb, idx) => (
                        <span
                            key={crumb.id || "root"}
                            className="flex items-center"
                        >
                            <button
                                className={`hover:underline ${
                                    idx === breadcrumb.length - 1
                                        ? "font-bold text-black"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleBreadcrumbClick(crumb, idx)
                                }
                                disabled={idx === breadcrumb.length - 1}
                            >
                                {crumb.name}
                            </button>
                            {idx < breadcrumb.length - 1 && (
                                <span className="mx-2">/</span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

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
                    {canAddNew && (
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
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Folders</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {folders.map((folder) => {
                        const canEdit =
                            folder.owner_id === auth.user.id ||
                            folder.shared_permission === "editor";
                        return (
                            <FolderCard
                                id={folder.id}
                                name={folder.name}
                                onDelete={() =>
                                    fetchItems("Folder deleted successfully")
                                }
                                onRename={() =>
                                    fetchItems("Folder renamed successfully")
                                }
                                onFolderClick={() => handleItemClick(folder)}
                                canEdit={canEdit}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Files</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Owner</th>
                            <th
                                className="py-2 px-3 cursor-pointer select-none"
                                onClick={() =>
                                    setSortOrder(
                                        sortOrder === "desc" ? "asc" : "desc"
                                    )
                                }
                            >
                                Last Modified{" "}
                                {sortOrder === "desc" ? (
                                    <ChevronDown className="inline w-4 h-4" />
                                ) : (
                                    <ChevronUp className="inline w-4 h-4" />
                                )}
                            </th>
                            <th className="py-2 px-3">File Size</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...files]
                            .sort((a, b) => {
                                const dateA = new Date(
                                    a.updated_at || a.created_at
                                );
                                const dateB = new Date(
                                    b.updated_at || b.created_at
                                );
                                return sortOrder === "desc"
                                    ? dateB - dateA
                                    : dateA - dateB;
                            })
                            .map((file) => {
                                const isMe = file.owner_id === auth.user.id;
                                const ownerName = isMe
                                    ? "me"
                                    : file.owner_name ||
                                      `User ${file.owner_id}`;
                                const fileDate = dayjs(
                                    file.updated_at || file.created_at
                                );
                                let modifiedDisplay;
                                if (fileDate.isSame(dayjs(), "day")) {
                                    modifiedDisplay = `${fileDate.format(
                                        "h:mm A"
                                    )} ${ownerName}`;
                                } else {
                                    modifiedDisplay = `${fileDate.format(
                                        "MMM DD, YYYY"
                                    )} ${ownerName}`;
                                }
                                const canEdit =
                                    folder.owner_id === auth.user.id ||
                                    file.owner_id === auth.user.id ||
                                    file.shared_permission === "editor";
                                return (
                                    <FileRow
                                        id={file.id}
                                        name={file.name}
                                        type={file.type}
                                        mimeType={file.mime_type}
                                        owner={ownerName}
                                        modified={modifiedDisplay}
                                        size={
                                            file.size
                                                ? `${Math.round(
                                                      file.size / 1024
                                                  )} KB`
                                                : ""
                                        }
                                        path={file.path}
                                        onDelete={() =>
                                            fetchItems(
                                                "File deleted successfully"
                                            )
                                        }
                                        onRename={() =>
                                            fetchItems(
                                                "File renamed successfully"
                                            )
                                        }
                                        onFileClick={() =>
                                            handleItemClick(file)
                                        }
                                        canEdit={canEdit}
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
                onSaved={() => fetchItems("Folder created successfully")}
                parentId={folder.id}
            />

            {/* Modal Upload File */}
            <ModalUploadFile
                isOpen={showModalUploadFile}
                onClose={() => setShowModalUploadFile(false)}
                onSaved={() => fetchItems("File uploaded successfully")}
                parentId={folder.id}
            />

            {/* Modal Preview File */}
            <PreviewModal
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </AuthenticatedLayout>
    );
}
