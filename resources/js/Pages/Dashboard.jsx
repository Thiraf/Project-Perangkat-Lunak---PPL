import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            <div className="mt-6">
                <h2 className="text-xl font-semibold">Document</h2>
                <div className="mt-4 flex space-x-2">
                    <select className="border rounded px-2 py-1">
                        <option>Choose Tag</option>
                    </select>
                    <select className="border rounded px-2 py-1">
                        <option>Type</option>
                    </select>
                    <select className="border rounded px-2 py-1">
                        <option>Filter</option>
                    </select>
                    <button className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                        + Add New
                    </button>
                </div>

                {/* Dropzone area */}
                <div className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-white p-12 rounded-lg shadow-sm">
                    <img
                        src="/images/folder-icon.png"
                        alt="Dropzone"
                        className="w-24 mb-4"
                    />
                    <p className="text-lg font-medium">Drop file here</p>
                    <p className="text-gray-500 text-sm">
                        or use the “New” button
                    </p>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
