import React from 'react'
import logo from '../../assets/favicon.png'

function Loader() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex items-center justify-center mb-4">
                <img src={logo} alt='logo' className='w-16 h-16 opacity-75 animate-bounce' />
            </div>
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4 text-lg font-semibold">Outstagram is loading...</p>
        </div>
    )
}

export default Loader
