export default function Dropzone({ onDrop }) {
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop && onDrop(Array.from(e.dataTransfer.files));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onDrop && onDrop(Array.from(e.target.files));
        }
    };

    return (
        <div
            className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-[#E9EEF6] p-12 rounded-lg shadow-sm cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <img
                src="/images/dropfile.png"
                alt="Dropzone"
                className="w-20 h-20 object-contain mb-4"
            />
            <p className="text-lg font-medium text-gray-800">Drop file here</p>
            <p className="text-gray-600 text-sm">or use the “New” button</p>
            <input
                type="file"
                className="hidden"
                id="dropzone-file-input"
                onChange={handleFileInput}
            />
            <label htmlFor="dropzone-file-input" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-sm">Browse</label>
        </div>
    );
}
