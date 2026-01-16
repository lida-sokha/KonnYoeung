import React from 'react';

interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
}

export default function Button({ text, onClick, className }: ButtonProps) {
    return (
        <button onClick={onClick} className={`bg-[#3ba8df] hover:bg-[#3292c4] text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 ${className}`}>
            {text}
        </button>
    )
}