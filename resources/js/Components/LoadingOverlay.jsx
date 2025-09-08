import React from 'react';

const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <p className="mt-4 font-bold text-lg text-white">Loading...</p>
        </div>
    </div>
);

export default LoadingOverlay;