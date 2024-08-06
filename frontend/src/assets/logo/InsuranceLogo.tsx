import React from 'react';

interface IconProps {
    color?: string; // Allow color to be passed as a prop
}

const InsuranceLogo: React.FC<IconProps> = ({ color = "#FFFFFF" }) => {
    return (
        <svg
            width="50"
            height="50"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            style={{ maxWidth: '100%', height: 'auto', width: '40px' }}
            fill={color}>
            <g fill="none" stroke={color} strokeWidth="4">
                <circle cx="16" cy="48" r="12" /> 
                <circle cx="48" cy="48" r="12" /> 
                <line x1="16" y1="48" x2="32" y2="24" /> 
                <line x1="32" y1="24" x2="48" y2="48" /> 
                <line x1="32" y1="24" x2="24" y2="12" /> 
                <line x1="24" y1="12" x2="16" y2="48" /> 
                <line x1="32" y1="24" x2="40" y2="12" /> 
                <line x1="40" y1="12" x2="48" y2="48" /> 
            </g>
        </svg>
    );
};

export default InsuranceLogo;
