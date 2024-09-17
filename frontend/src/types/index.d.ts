declare module '@somkid.sim/react-org-chart-ts' {
    import React, { Component } from 'react';

    interface Person {
        id: number;
        avatar: string;
        department: string;
        name: string;
        title: string;
        totalReports: number;
        color?: string;
    }
    
    interface Node {
        id: number;
        person: Person;
        hasChild: boolean;
        hasParent: boolean;
        children: Node[];
    }
    
    interface OrgChartProps {
        tree: Node;
        defaultConfig?: any;
        zoomInId?: string;
        zoomOutId?: string;
        resetPositionId?: string;
        minZoom?: number;
        maxZoom?: number;
        lineType?: 'angle' | 'curve';  // Explicitly typed string literals
        onConfigChange: (config: any) => void;
        loadConfig: (d: any) => any;
        loadImage: (data: any) => Promise<string>;
        loadParent: (d: any) => any;
        loadChildren: (d: any) => any;
        showDetail?: (d: any) => void;  
    }

    export default class OrgChart extends Component<OrgChartProps> {
        render(): JSX.Element;
    }
}
