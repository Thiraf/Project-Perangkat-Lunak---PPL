import ActionMenu from "./ActionMenu";

function getFileIconType(mimeType) {
    // This function remains the same, but it's now called with the 'type' prop.
    if (!mimeType) return "file";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("wordprocessingml")) return "docx";
    if (mimeType.includes("spreadsheetml")) return "xlsx";
    if (mimeType.includes("presentationml")) return "pptx";
    if (mimeType === "text/csv") return "csv";
    return "file";
}

// Updated to accept individual props to match the parent component's usage.
export default function FileRow({ id, name, type, owner, modified, size, onDelete, onRename, onFileClick }) {
    // If the 'type' prop (which is the mime_type) is null, we'll treat it as a folder.
    const icon = type ? getFileIconType(type) : 'folder';

    return (
        <tr 
            className="border-b hover:bg-gray-50 border-gray-300" 
            style={{ cursor: "pointer" }}
            onClick={onFileClick}
        >
            <td className="py-2 px-3 flex items-center space-x-2">
                <img
                    src={`/images/${icon}.png`}
                    alt={icon}
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

