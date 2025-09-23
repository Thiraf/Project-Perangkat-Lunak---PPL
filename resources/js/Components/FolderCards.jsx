import ActionMenu from "@/Components/ActionMenu";

export default function FolderCard({
    id,
    name,
    type,
    onDelete,
    onRename,
    onFolderClick,
    onShare,
    canEdit,
}) {
    return (
        <div
            className="flex justify-between items-center border rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow-md cursor-pointer"
            onClick={onFolderClick}
        >
            <span className="font-medium">{name}</span>
            {canEdit ? (
                <ActionMenu
                    id={id}
                    name={name}
                    type={type}
                    onDelete={onDelete}
                    onRename={onRename}
                    onShare={onShare}
                />
            ) : (
                <img
                    src="/images/share.png"
                    alt="Shared"
                    className="w-4 h-4 ml-2"
                    title="Shared with you"
                />
            )}
        </div>
    );
}
