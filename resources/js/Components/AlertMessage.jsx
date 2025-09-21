import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AlertMessage({
    message,
    type = "success",
    show,
    onClose,
    onRetry,
}) {
    const [shouldRender, setShouldRender] = useState(show);

    useEffect(() => {
        let timeoutId;
        if (show) {
            setShouldRender(true);
        } else if (!show && shouldRender) {
            timeoutId = setTimeout(() => {
                setShouldRender(false);
            }, 500);
        }
        return () => clearTimeout(timeoutId);
    }, [show, shouldRender]);

    useEffect(() => {
        if (show && type !== "modal") {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [show, onClose, type]);

    if (!shouldRender) return null;

    // === CASE 1: Toast kecil bawah layar ===
    if (type === "success" || type === "error") {
        const color = type === "success" ? "bg-green-600" : "bg-red-500";
        return (
            <div
                className={`fixed left-1/2 bottom-10 z-50 px-4 py-3 rounded-lg shadow-xl text-white font-semibold ${color} ${
                    show ? "fade-in" : "fade-out"
                }`}
                role="alert"
                style={{
                    minWidth: 250,
                    textAlign: "center",
                    transform: "translateX(-50%)",
                }}
            >
                {message}
                <style>{`
          .fade-in { animation: fadeInAnimation 0.5s ease-out forwards; }
          .fade-out { animation: fadeOutAnimation 0.5s ease-out forwards; }
          @keyframes fadeInAnimation {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          @keyframes fadeOutAnimation {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, 20px); }
          }
        `}</style>
            </div>
        );
    }

    // === CASE 2: Modal error tengah layar ===
    if (type === "modal") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div
                    className={`bg-white rounded-xl shadow-xl p-8 relative w-[350px] text-center transform transition-all duration-300 ${
                        show ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
                >
                    {/* Tombol close */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>

                    {/* Gambar error custom */}
                    <div className="flex justify-center mb-4">
                        <img
                            src="/images/erroralert.png"
                            alt="Error Alert"
                            className="w-20 h-20 object-contain"
                        />
                    </div>

                    {/* Title + message */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Oopsie!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {message || "It looks like something went wrong"}
                    </p>

                    {/* Retry button */}
                    <button
                        onClick={onRetry}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
