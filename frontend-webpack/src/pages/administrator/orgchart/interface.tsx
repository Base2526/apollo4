export interface Person {
    id: number;
    avatar: string;
    department: string;
    name: string;
    title: string;
    totalReports: number;
    color: string;
}

export interface Node {
    id: number;
    person: Person;
    hasChild: boolean;
    hasParent: boolean;
    children: Node[];
}
  
export interface TreeNode {
    id: number;
    person: Person;
    hasChild: boolean;
    hasParent: boolean;
    children: TreeNode[];
}