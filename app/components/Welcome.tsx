'use client'
import React, { useEffect, useState } from 'react';

type Props = {
    changescreen: (screen: string) => void;
};

const Welcome = ({ changescreen }: Props) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 1;
                if (next >= 100) {
                    clearInterval(interval);
                    // use setTimeout to avoid updating parent during render
                    setTimeout(() => changescreen('intro'), 100);
                }
                return next >= 100 ? 100 : next;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [changescreen]);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center  p-4">
            {/* Logo */}
            <div className="flex items-center justify-center p-6 rounded-xl">
                <img
                    src="gamelogo.png"
                    alt="Game Logo"
                    className="w-[60vw] sm:w-[40vw] md:w-[25vw] object-contain"
                />
            </div>

            {/* Title */}
            <div className="mt-6 text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                    Welcome to Hoppy Frog Game
                </h1>
            </div>

            {/* Progress bar */}
            <div className="w-[70vw] sm:w-[50vw] md:w-[30vw] h-4 bg-gray-300 rounded-full overflow-hidden mt-8">
                <div
                    className="h-full bg-green-500 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Percentage */}
            <p className="mt-3 text-lg font-medium text-white">{progress}%</p>
        </div>
    );
};

export default Welcome;

