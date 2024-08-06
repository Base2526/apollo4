// Breadcrumb.tsx
import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    
    // Split the path into segments
    const pathSegments = location.pathname.split('/').filter((segment) => segment);

    // Create breadcrumb items
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={path}>
                <Link to={path}>{segment.charAt(0).toUpperCase() + segment.slice(1)}</Link>
            </Breadcrumb.Item>
        );
    });

    // Add the home breadcrumb
    breadcrumbItems.unshift(
        <Breadcrumb.Item key="/">
            <Link to="/">Home</Link>
        </Breadcrumb.Item>
    );

    return (
        <Breadcrumb style={{ margin: '10px 0' }}>
            {breadcrumbItems}
        </Breadcrumb>
    );
};

export default Breadcrumbs;
