export default function Dropzone() {
    return (
        <div className="mt-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-[#E9EEF6] p-12 rounded-lg shadow-sm">
            <img
                src="/images/dropfile.png"
                alt="Dropzone"
                className="w-20 h-20 object-contain mb-4"
            />
            <p className="text-lg font-medium text-gray-800">Drop file here</p>
            <p className="text-gray-600 text-sm">or use the “New” button</p>
        </div>
    );
}
