interface Person {
    id: number;
    avatar: string;  // Assuming this is a URL or a placeholder
    department: string;
    name: string;
    title: string;
    totalReports: number;
    color: string;
}

interface TreeNode {
    id: number;
    person: Person;
    hasChild: boolean;
    hasParent: boolean;
    children: TreeNode[];
}

// Function to generate a random color in hexadecimal format
const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
  
const generatePerson = (id: number, name: string, title: string): Person => ({
    id,
    avatar: 'default_avatar.png', // Placeholder for avatar
    department: '',
    name,
    title,
    totalReports: 0,
    color: getRandomColor(), // Assign a random color
});
  
const createTreeNode = (id: number, name: string, title: string, numChildren: number, currentLevel: number, maxLevels: number): TreeNode => {
    const hasChild = currentLevel < maxLevels;

    // Create children recursively if there should be more levels
    const children: TreeNode[] = hasChild 
        ? Array.from({ length: numChildren }, (_, index) => 
            createTreeNode(id * 10 + index + 1, `Child ${id * 10 + index + 1}`, title, numChildren, currentLevel + 1, maxLevels)
        )
        : [];

    return {
        id,
        person: generatePerson(id, `Person ${id}`, title),
        hasChild,
        hasParent: currentLevel > 0,
        children,
    };
};
  
const generateTreeData = (numTopLevelNodes: number, numChildren: number, maxLevels: number): TreeNode[] => {
    return Array.from({ length: numTopLevelNodes }, (_, index) => 
        createTreeNode(index + 1, `Top Level ${index + 1}`, 'Manager', numChildren, 0, maxLevels)
    );
};
  
//  Example usage
//   const treeData = generateTreeData(1, 2, 4); // 1 top-level node, 2 children per node, 4 levels deep
//   console.log(JSON.stringify(treeData, null, 2));
  
export { 
    generateTreeData
}
  