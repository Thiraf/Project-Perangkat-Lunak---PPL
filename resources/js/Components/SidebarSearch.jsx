import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Link } from "@inertiajs/react";
import PreviewModal from "./PreviewModal";
import LoadingOverlay from "./LoadingOverlay";
import MarqueeOnHover from "./MarqueeOnHover";

export default function SidebarSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ folders: [], files: [] });
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const popupRef = useRef();
    const [previewFile, setPreviewFile] = useState(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.trim().length === 0) {
            setResults({ folders: [], files: [] });
            setShowPopup(false);
            return;
        }
        setIsSearching(true);
        try {
            const res = await axios.get("/items/search", { params: { q: value } });
            setResults(res.data);
            setShowPopup(true);
        } catch (err) {
            setResults({ folders: [], files: [] });
            setShowPopup(false);
        } finally {
            setIsSearching(false);
        }
    };

    const handleItemClick = (item) => {
        if (item.type === "folder") {
            window.location.href = `/${auth.user.id}/folders/${item.id}`;
            return;
        }

        setIsLoading(true);
        axios
            .get(route("items.show", { id: item.id }))
            .then((response) => {
                setPreviewFile(response.data);
            })
            .catch((error) => {
                console.error("Error fetching file details:", error);
                alert("Could not load file for preview.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="relative mb-4" ref={popupRef}>
            {isLoading && <LoadingOverlay />}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                onFocus={() => query && setShowPopup(true)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {showPopup && (
                <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto border">
                    {isSearching && <div className="p-4 text-center text-gray-500">Searching...</div>}
                    {!isSearching && (
                        <>
                            {results.folders.length > 0 && (
                                <div>
                                    <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Folders</div>
                                    {results.folders.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route("folders.view", [item.owner_id, item.id])}
                                            className="flex items-center px-4 py-2 hover:bg-orange-50"
                                            onClick={() => setShowPopup(false)}
                                            title={item.name}
                                        >
                                            <span className="mr-2">📁</span>
                                            <div className="flex-1 min-w-0"> {/* Add min-w-0 to parent */}
                                                <MarqueeOnHover text={item.name} /> {/* Use the new component */}
                                                {item.parent_name && (
                                                    <div className="text-xs text-gray-400 truncate">in {item.parent_name}</div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {results.files.length > 0 && (
                                <div>
                                    <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Files</div>
                                    {results.files.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleItemClick(item)}
                                            className="w-full text-left flex items-center px-4 py-2 hover:bg-orange-50"
                                            title={item.name}
                                            aria-label={item.name}
                                        >
                                            <span className="mr-2">📄</span>
                                            <div className="flex-1 min-w-0"> {/* Add min-w-0 to parent */}
                                                <MarqueeOnHover text={item.name} /> {/* Use the new component */}
                                                {item.parent_name && (
                                                    <div className="text-xs text-gray-400 truncate">in {item.parent_name}</div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.folders.length === 0 && results.files.length === 0 && (
                                <div className="p-4 text-center text-gray-400">No results found.</div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Modal Preview File */}
            <PreviewModal
                file={previewFile}
                onClose={() => setPreviewFile(null)}
            />
        </div>
    );
}
