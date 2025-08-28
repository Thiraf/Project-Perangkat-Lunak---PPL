export default function Hello({ name }) {
    return (
        <div className="p-6 bg-green-200 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-green-800">
                Hello, {name}! 🎉
            </h1>
            <p className="text-green-700">Ini React jalan di dalam Laravel.</p>
        </div>
    );
}
