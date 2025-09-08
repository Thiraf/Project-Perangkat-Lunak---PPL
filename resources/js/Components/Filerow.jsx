import ActionMenu from "@/Components/ActionMenu";

export default function FileRow({ id, name, type, owner, modified, size, onDelete, onRename }) {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="py-2 px-3 flex items-center space-x-2">
                <img
                    src={`/images/${type}.png`}
                    alt={type}
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
