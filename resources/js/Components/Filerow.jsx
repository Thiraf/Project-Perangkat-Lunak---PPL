import ActionMenu from "@/Components/ActionMenu";

function getFileIconType(mimeType) {
    if (!mimeType) return "file";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
    if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
    if (mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation") return "pptx";
    if (mimeType === "text/csv") return "csv";
    return "file";
}

export default function FileRow({ id, name, type, owner, modified, size, path, onDelete, onRename }) {
    return (
        <tr className="border-b hover:bg-gray-50 border-gray-300" style={{ cursor: "pointer" }}>
            <td className="py-2 px-3 flex items-center space-x-2">
                <img
                    src={`/images/${getFileIconType(type)}.png`}
                    alt={getFileIconType(type)}
                    className="w-6 h-6"
                />
                <span>{name}</span>
            </td>
            <td className="py-2 px-3">{owner}</td>
            <td className="py-2 px-3">{modified}</td>
            <td className="py-2 px-3">{size}</td>
            <td className="py-2 px-3">
                <ActionMenu id={id} name={name} onDelete={onDelete} onRename={onRename} />
            </td>
        </tr>
    );
}