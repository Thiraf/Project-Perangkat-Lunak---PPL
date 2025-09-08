import { useState, useEffect } from "react";

export default function AlertMessage({ message, type = "success", show, onClose }) {
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

        return () => {
            clearTimeout(timeoutId);
        };
    }, [show, shouldRender]);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!shouldRender) {
        return null;
    }

    const color = type === "success" ? "bg-green-600" : "bg-red-500";

    return (
        <div
            className={`fixed left-1/2 bottom-10 z-50 px-4 py-3 rounded-lg shadow-xl text-white font-semibold ${color} ${show ? 'fade-in' : 'fade-out'}`}
            role="alert"
            style={{ minWidth: 250, textAlign: 'center' }}
        >
            {message}
            <style>{`
                .fade-in {
                    animation: fadeInAnimation 0.5s ease-out forwards;
                }
                .fade-out {
                    animation: fadeOutAnimation 0.5s ease-out forwards;
                }
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
