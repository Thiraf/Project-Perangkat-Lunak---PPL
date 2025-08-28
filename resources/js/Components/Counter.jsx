import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div className="p-6 bg-blue-100 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Counter Demo</h2>
            <p className="text-xl mb-4">Nilai sekarang: {count}</p>
            <button
                onClick={() => setCount(count + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Tambah
            </button>
        </div>
    );
}
