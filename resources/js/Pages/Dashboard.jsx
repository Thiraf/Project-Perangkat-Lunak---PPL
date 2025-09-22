import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import dayjs from "dayjs";
import CustomSelect from "@/Components/CustomSelect";
import ModalNewFolder from "@/Components/Modalnewfolder";
import ModalUploadFile from "@/Components/Modaluploadfile";
import FolderCard from "@/Components/FolderCard";
import FileRow from "@/Components/FileRow";
import AlertMessage from "@/Components/AlertMessage";
import LoadingOverlay from "@/Components/LoadingOverlay";
import { ChevronDown, ChevronUp } from "lucide-react";
import PreviewModal from "@/Components/PreviewModal";

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
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({
        show: false,
        message: "",
        type: "success",
    });
    const [previewFile, setPreviewFile] = useState(null);

    const fetchItems = useCallback((alertMsg = null) => {
        setIsLoading(true);
        axios
            .get("/items")
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
                    message: "Oops! Something went wrong.",
                    type: "error", // ini otomatis trigger modal
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

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
        fetchItems();
    }, [fetchItems]);

    const handleItemClick = (item) => {
        console.log("Item clicked:", item);

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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            {isLoading && <LoadingOverlay />}

            <AlertMessage
                show={alert.show}
                message={alert.message}
                type={alert.type === "error" ? "modal" : alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
                onRetry={() => fetchItems()}
            />

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
                    {folders.map((folder) => {
                        const canEdit = folder.owner_id === auth.user.id;
                        return (
                            <FolderCard
                                id={folder.id}
                                name={folder.name}
                                type={folder.type}
                                onShare={() => {
                                    fetchItems("Folder shared successfully");
                                    setAlert({
                                        show: true,
                                        message:
                                            "User added to folder successfully",
                                        type: "success",
                                    });
                                }}
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

            {/* Tombol simulasi error */}
            <div className="mb-4">
                <button
                    onClick={() =>
                        setAlert({
                            show: true,
                            message: "It looks like something went wrong",
                            type: "error",
                        })
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    🔥 Trigger Error Alert
                </button>
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
                                const canEdit = file.owner_id === auth.user.id;
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
                                        onShare={() => {
                                            fetchItems(
                                                "File shared successfully"
                                            );
                                            setAlert({
                                                show: true,
                                                message:
                                                    "User added to file successfully",
                                                type: "success",
                                            });
                                        }}
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
            />

            {/* Modal Upload File */}
            <ModalUploadFile
                isOpen={showModalUploadFile}
                onClose={() => setShowModalUploadFile(false)}
                onSaved={() => fetchItems("File uploaded successfully")}
            />

            {/* Modal Preview File */}
            <PreviewModal
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </AuthenticatedLayout>
    );
}
