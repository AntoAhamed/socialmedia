import React from 'react'

function Loader() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
            <p className="text-gray-300 mt-3">Outstagram is loading...</p>
        </div>
    )
}

export default Loader
