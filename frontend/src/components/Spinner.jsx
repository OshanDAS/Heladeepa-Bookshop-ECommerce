import React from 'react';

const Spinner = ({ 
    size = 'md', 
    color = '#8D6E63', 
    className = '',
    text = 'Loading...',
    showText = true
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const textSizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg'
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className="relative">
                {/* Outer ring */}
                <div 
                    className={`${sizeClasses[size]} rounded-full border-2 border-t-transparent animate-spin`}
                    style={{ borderColor: `${color} transparent ${color} ${color}` }}
                />
                {/* Inner ring */}
                <div 
                    className={`${sizeClasses[size]} absolute top-0 left-0 rounded-full border-2 border-b-transparent animate-spin`}
                    style={{ 
                        borderColor: `${color} ${color} transparent ${color}`,
                        animationDirection: 'reverse',
                        animationDuration: '1.5s'
                    }}
                />
            </div>
            {showText && (
                <p 
                    className={`mt-2 font-medium ${textSizeClasses[size]}`}
                    style={{ color }}
                >
                    {text}
                </p>
            )}
        </div>
    );
};

export default Spinner; 
