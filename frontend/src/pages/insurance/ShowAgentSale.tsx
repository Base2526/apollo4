// DataTable.tsx
import React, { useState } from 'react';
import { Table, Input } from 'antd';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '5',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '6',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    // Add more data as needed
];

const ShowAgentSale: React.FC = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<DataType[]>(data);

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data.filter((item) => 
            item.name.toLowerCase().includes(value.toLowerCase()) ||
            item.address.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a: DataType, b: DataType) => a.name.localeCompare(b.name),
        },
        {
            title: 'Age',
            dataIndex: 'age',
            sorter: (a: DataType, b: DataType) => a.age - b.age,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a: DataType, b: DataType) => a.address.localeCompare(b.address),
        },
    ];

    return (
        <div>
            <Input.Search
                placeholder="Search..."
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ marginBottom: 16 }}
            />
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 5 }}
                rowKey="key"
            />
        </div>
    );
};

export default ShowAgentSale;
