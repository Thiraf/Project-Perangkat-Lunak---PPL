import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({
    label,
    options,
    primary,
    value,
    onChange,
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-40" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-2 shadow-sm ${
                    primary
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white border text-gray-700"
                }`}
            >
                <span>
                    {value
                        ? options.find((o) => o.value === value)?.label
                        : label}
                </span>
                <ChevronDown className="h-4 w-4" />
            </button>

            {open && (
                <div className="absolute mt-2 w-full rounded-xl border bg-white shadow-lg z-50">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-xl flex items-center space-x-2"
                        >
                            {opt.image && (
                                <img
                                    src={opt.image}
                                    alt={opt.label}
                                    className="w-5 h-5"
                                />
                            )}
                            <span>{opt.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
