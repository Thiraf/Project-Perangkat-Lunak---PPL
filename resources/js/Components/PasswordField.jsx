import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * A reusable password input component with a show/hide toggle.
 *
 * @param {{
 * data: { password: '' },
 * setData: (key: string, value: any) => void,
 * errors: { password?: string }
 * }} props
 */
export default function PasswordField({ data, setData, errors }) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div>
            {/* Wrapper div to position the icon inside the input */}
            <div className="relative">
                <input
                    // The input type is dynamic based on the state
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) =>
                        setData("password", e.target.value)
                    }
                    // Added padding on the right (pr-10) to make space for the icon
                    className="w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {/* Toggle button positioned inside the input field */}
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Error message display */}
            {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                    {errors.password}
                </p>
            )}
        </div>
    );
}
