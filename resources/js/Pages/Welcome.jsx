import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="flex flex-col min-h-screen bg-[#f5f7fa] overflow-hidden">
                {/* Navbar */}
                <header className="flex justify-between items-center px-8 py-4 bg-[#ff5c00] text-white">
                    <h1 className="text-xl font-bold tracking-wide">DOKI</h1>
                    <Link
                        href={route("login")}
                        className="bg-white text-[#ff5c00] font-semibold px-5 py-2 rounded-md hover:bg-[#ffe6d2] transition"
                    >
                        SIGN IN
                    </Link>
                </header>

                {/* Hero */}
                <main className="relative flex-1 flex items-center px-10 md:px-20 pt-10 pb-0">
                    {/* Kanan: pinyu menempel pojok kanan */}
                    <div className="pointer-events-none absolute bottom-0 right-0 flex items-end">
                        <img
                            src="/images/pinyu.png"
                            alt="Document Management Illustration"
                            className="h-[70vh] md:h-[90vh] w-auto drop-shadow-2xl select-none"
                        />
                    </div>

                    {/* Kiri: konten dengan padding sendiri */}
                    <div className="relative z-10 px-10 md:pl-20 max-w-3xl mt-16 md:mt-28">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                            DOCUMENT <br /> MANAGEMENT SYSTEM
                        </h2>
                        <p className="text-gray-600 text-2xl mb-8 leading-relaxed">
                            Platform pintar yang memudahkan pengelolaan dokumen
                            berlabel dan memungkinkan berbagi file dengan rekan
                            kerja secara praktis.
                        </p>

                        <Link
                            href={route("register")}
                            className="bg-[#ff5c00] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#ff7326] transition"
                        >
                            Get Started →
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
