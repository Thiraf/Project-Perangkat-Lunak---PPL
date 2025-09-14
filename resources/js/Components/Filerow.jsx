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

export default function FileRow({ id, name, type, mimeType, owner, modified, size, onDelete, onRename, onFileClick, onShare, canEdit }) {
    const icon = type ? getFileIconType(mimeType) : 'folder';

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
                {!canEdit && (
                    <img src="/images/share.png" alt="Shared" className="w-4 h-4 ml-2" title="Shared with you" />
                )}
            </td>
            <td className="py-2 px-3">{owner}</td>
            <td className="py-2 px-3">{modified}</td>
            <td className="py-2 px-3">{size}</td>
            <td className="py-2 px-3">
                {canEdit && (
                    <ActionMenu id={id} name={name} type={type} onDelete={onDelete} onRename={onRename} onShare={onShare} />
                )}
            </td>
        </tr>
    );
}

