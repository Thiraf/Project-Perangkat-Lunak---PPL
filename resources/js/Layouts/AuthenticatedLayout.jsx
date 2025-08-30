import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Home, User, LogOut, FileText, Tag, Settings } from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <div className="flex-1 flex flex-col">
            <header className="bg-orange-500 shadow px-6 py-4 flex items-center justify-between text-white">
                <div>{header}</div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-600"
                    >
                        <User className="h-5 w-5 text-white" />

                        <span className="text-sm font-medium text-white">
                            {user.name}
                        </span>

                        <svg
                            className={`w-4 h-4 transform transition-transform text-white ${
                                dropdownOpen ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 text-black">
                            <Link
                                href={route("profile.edit")}
                                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex min-h-screen bg-gray-100">
                {/* Sidebar */}
                <aside
                    className={`bg-white shadow-md transition-all duration-300 ${
                        sidebarOpen ? "w-64" : "w-20"
                    } flex flex-col`}
                >
                    <div className="flex items-center justify-between px-4 py-4">
                        <Link href="/" className="flex items-center space-x-2">
                            {sidebarOpen && (
                                <span className="font-bold">DOKI</span>
                            )}
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ☰
                        </button>
                    </div>

                    <nav className="flex-1 px-2 space-y-2">
                        <Link
                            href={route("dashboard")}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            <Home className="h-5 w-5" />
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>
                        <Link
                            href={route("profile.edit")}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            <FileText className="h-5 w-5" />
                            {sidebarOpen && <span>Document</span>}
                        </Link>
                        <Link
                            href={route("profile.edit")}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            <Tag className="h-5 w-5" />
                            {sidebarOpen && <span>Tag</span>}
                        </Link>
                        <Link
                            href={route("profile.edit")}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            <Settings className="h-5 w-5" />
                            {sidebarOpen && <span>Setting</span>}
                        </Link>
                        <Link
                            href={route("profile.edit")}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            <User className="h-5 w-5" />
                            {sidebarOpen && <span>User</span>}
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
