import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import CustomSelect from "@/Components/CustomSelect";
import Dropzone from "@/Components/Dropzone";
import ModalNewFolder from "@/Components/Modalnewfolder";
import ModalUploadFile from "@/Components/Modaluploadfile";
import FolderCard from "@/Components/FolderCard";
import FileRow from "@/Components/FileRow";

export default function Dashboard({ auth }) {
    const [label, setLabel] = useState("");
    const [type, setType] = useState("");
    const [filter, setFilter] = useState("");
    const [newItem, setNewItem] = useState("");

    const [showModalNewFolder, setshowModalNewFolder] = useState(false);
    const [showModalUploadFile, setShowModalUploadFile] = useState(false);

    const folders = [
        { id: 1, name: "Business Memo" },
        { id: 2, name: "Business Plan" },
        { id: 3, name: "Business Trip" },
        { id: 4, name: "Business Review" },
    ];

    const files = [
        {
            id: 1,
            name: "Data Stok 2025.csv",
            type: "csv",
            owner: "Me",
            modified: "Sep 1, 2025",
            size: "11 MB",
        },
        {
            id: 2,
            name: "Laporan.docx",
            type: "docx",
            owner: "Me",
            modified: "Jun 18, 2025",
            size: "8 MB",
        },
        {
            id: 3,
            name: "Proposal.pdf",
            type: "pdf",
            owner: "Me",
            modified: "Feb 20, 2025",
            size: "23 MB",
        },
    ];

    useEffect(() => {
        if (newItem === "newfolder") {
            setshowModalNewFolder(true);
            setNewItem("");
        } else if (newItem === "fileupload") {
            setShowModalUploadFile(true);
            setNewItem("");
        }
    }, [newItem]);

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
                    {folders.map((f) => (
                        <FolderCard key={f.id} name={f.name} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Files</h3>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-2 px-3">Files</th>
                            <th className="py-2 px-3">Owner</th>
                            <th className="py-2 px-3">Last Modified</th>
                            <th className="py-2 px-3">File Size</th>
                            <th className="py-2 px-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <FileRow key={file.id} {...file} />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Folder */}
            <ModalNewFolder
                isOpen={showModalNewFolder}
                onClose={() => setshowModalNewFolder(false)}
            />

            {/* Modal Upload File */}
            <ModalUploadFile
                isOpen={showModalUploadFile}
                onClose={() => setShowModalUploadFile(false)}
            />
        </AuthenticatedLayout>
    );
}
