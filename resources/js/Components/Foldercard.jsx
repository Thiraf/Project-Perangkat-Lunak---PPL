import ActionMenu from "@/Components/ActionMenu";

export default function FolderCard({ name }) {
    return (
        <div className="flex justify-between items-center border rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow-md cursor-pointer">
            <span className="font-medium">{name}</span>
            <ActionMenu name={name} />
        </div>
    );
}
