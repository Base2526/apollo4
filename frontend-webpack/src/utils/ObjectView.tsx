// CollapsibleObjectView.tsx
import React, { useState } from 'react';

interface CollapsibleObjectViewProps {
    data: Record<string, any>; // Accept any object structure
}

const CollapsibleObjectView: React.FC<CollapsibleObjectViewProps> = ({ data }) => {
    return (
        <div style={{ marginLeft: '20px' }}>
            {Object.entries(data).map(([key, value]) => (
                <CollapsibleItem key={key} label={key} value={value} />
            ))}
        </div>
    );
};

interface CollapsibleItemProps {
    label: string;
    value: any;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({ label, value }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleCollapse = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div>
            <div onClick={toggleCollapse} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                {isOpen ? '−' : '+'} {label}
            </div>
            {isOpen && (
                <div style={{ paddingLeft: '10px' }}>
                    {typeof value === 'object' && value !== null ? (
                        <CollapsibleObjectView data={value} /> // Recursive rendering for nested objects
                    ) : (
                        <span>{String(value)}</span> // Render primitive values
                    )}
                </div>
            )}
        </div>
    );
};

export default CollapsibleObjectView;
