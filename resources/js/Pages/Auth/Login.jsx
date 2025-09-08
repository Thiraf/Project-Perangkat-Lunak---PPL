import { useForm, Head } from "@inertiajs/react";

export default function Login({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="min-h-screen h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <div className="bg-orange-600 p-4 text-white font-bold text-lg">
                DOKI
            </div>

            {/* Content */}
            <div className="flex flex-1 h-full overflow-hidden">
                {/* Left side (Form) */}
                <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full p-8">
                        <h2 className="text-3xl font-bold mb-2">
                            Welcome back to DOKI!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Log in now to manage your documents securely,
                            quickly, and easily.
                        </p>

                        {status && (
                            <div className="mb-4 text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            {/* Email */}
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-600">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center justify-between mt-4">
                                <label className="flex items-center text-sm text-gray-600">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    Remember Me
                                </label>
                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right side (Image) */}
        <div className="hidden md:block md:w-1/2 h-full">
                    <img
            src="/images/login-bg.png"
            alt="Login background"
            className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
