function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}
import ActionMenu from "./ActionMenu";

function getFileIconType(mimeType) {
    if (!mimeType) return "file";
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("wordprocessingml")) return "docx";
    if (mimeType === "application/vnd.ms-excel") return "xls";
    if (mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
    if (mimeType.includes("spreadsheetml")) return "xlsx";
    if (mimeType.includes("presentationml")) return "pptx";
    if (mimeType === "text/csv") return "csv";
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") return "jpg";
    if (mimeType === "image/png") return "png";
    if (mimeType === "text/plain") return "txt";
    return "file";
}

export default function FileRow({
    id,
    name,
    type,
    mimeType,
    owner,
    modified,
    size,
    labels,
    onDelete,
    onRename,
    onFileClick,
    onShare,
    canEdit,
}) {
    const icon = type ? getFileIconType(mimeType) : "folder";

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
                    <img
                        src="/images/share.png"
                        alt="Shared"
                        className="w-4 h-4 ml-2"
                        title="Shared with you"
                    />
                )}
            </td>
            <td className="py-2 px-3">{owner}</td>
            <td className="py-2 px-3">{modified}</td>
            <td className="py-2 px-3">{size}</td>
            <td className="py-2 px-3">
                {Array.isArray(labels) && labels.length
                    ? labels.map((label, idx) => (
                        <span
                            key={idx}
                            style={{
                                backgroundColor: label.color
                                    ? hexToRgba(label.color, 0.3)
                                    : "#eee",
                                color: "#222",
                                borderRadius: "4px",
                                padding: "2px 6px",
                                marginRight: "4px",
                                fontSize: "0.85em",
                                display: "inline-block"
                            }}
                        >
                            {label.name}
                        </span>
                    ))
                    : "-"}
            </td>
            <td className="py-2 px-3">
                {canEdit && (
                    <ActionMenu
                        id={id}
                        name={name}
                        type={type}
                        onDelete={onDelete}
                        onRename={onRename}
                        onShare={onShare}
                    />
                )}
            </td>
        </tr>
    );
}
