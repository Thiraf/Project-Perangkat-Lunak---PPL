import React from "react";

// Helper to get a generic file icon if preview is not available
function getFileIcon(mimeType) {
    if (!mimeType) return "/images/file.png"; // default icon
    if (mimeType.startsWith("image/")) return "/images/image.png"; // You can create a generic image icon
    if (mimeType === "application/pdf") return "/images/pdf.png";
    if (mimeType.includes("wordprocessingml")) return "/images/docx.png";
    if (mimeType.includes("spreadsheetml")) return "/images/xlsx.png";
    if (mimeType.includes("presentationml")) return "/images/pptx.png";
    return "/images/file.png";
}

export default function PreviewModal({ file, onClose }) {
    if (!file) {
        return null;
    }

    const renderPreview = () => {
        // For images, render an img tag
        if (file.mime_type.startsWith("image/")) {
            return <img src={file.url} alt={file.name} className="max-w-full max-h-[70vh] object-contain" />;
        }
        // For PDFs, use an iframe or embed
        if (file.mime_type === "application/pdf") {
            return <iframe src={file.url} className="w-full h-[80vh]" title={file.name}></iframe>;
        }
        // For other files, show an icon and a message
        return (
            <div className="text-center p-8">
                <img src={getFileIcon(file.mime_type)} alt="file icon" className="w-24 h-24 mx-auto mb-4" />
                <p className="text-lg text-gray-700">Preview is not available for this file type.</p>
                <p className="text-sm text-gray-500">{file.name}</p>
            </div>
        );
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-2xl p-4 md:p-6 w-11/12 md:w-3/4 lg:w-1/2 max-w-4xl"
                style={{ maxHeight: '98vh' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 truncate pr-4">{file.name}</h3>
                </div>
                
                <div className="preview-content flex justify-center items-center bg-gray-100 rounded">
                    {renderPreview()}
                </div>

                <div className="flex justify-end items-center border-t pt-4">
                     <a
                        href={file.url}
                        download={file.name}
                        className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Download
                    </a>
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-500 transition duration-300 ml-2"
                        type="button"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
