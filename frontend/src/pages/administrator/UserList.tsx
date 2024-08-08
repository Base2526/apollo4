import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Avatar, Space, Dropdown, Image } from 'antd';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import _ from "lodash"
import { DownOutlined } from '@ant-design/icons';

import { queryMembers } from "../../apollo/gqlQuery"
import { getHeaders, isValidUrl } from "../../utils"

// import AttackFileField from "../../components/basic/attack-file";

interface DataType {
    key: string;
    displayName: string;
    email: string;
    avatar?: string;
    roles:number[];
    timestamp: any;
}

const items = [
    { key: '1', label: 'Edit' },
    { key: '2', label: 'Delete' },
];

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<DataType[]>();
    const [data, setData] = useState<DataType[]>();
    const [files, setFiles] = useState<File[]>([]);

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            render:(avatar: any)=>{
                return isValidUrl(avatar) 
                        ? <Image  width={100} src={avatar} /> 
                        : <Image  width={100} src={"http://localhost:4000/" + avatar} /> 
            }
        },
        {
            title: 'User',
            dataIndex: 'displayName',
            sorter: (a: DataType, b: DataType) => a.displayName.localeCompare(b.displayName),
            render: (name: string) =>{
                return <Tag color="#2db7f5">{name}</Tag>
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a: DataType, b: DataType) => a.email.localeCompare(b.email),
            // render: (path: string) =>{
            //     let newPath = window.location.protocol +'//'+ window.location.hostname + ':4000/' + path
            //     return <a href={newPath} target="_blank" rel="noopener noreferrer">{ path }</a>
            // }
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            render: (roles: number[]) =>{
                return _.map(roles, role=>{
                    return <Tag color="#2db7f5">{role}</Tag>
                })
            }
        },
        {
            title: 'Date',
            dataIndex: 'timestamp',
            // sorter: (a: DataType, b: DataType) => a.address.localeCompare(b.address),
            render: (timestamp: string) =>{
                return <div>{(moment(new Date(timestamp), 'YYYY-MM-DD HH:mm')).format('MMMM Do YYYY, h:mm:ss a')}</div>
            }
        },
        {
            title: 'Action',
            key: 'action',
            sorter: true,
            render: () => (
                <Space size="middle">
                    <a onClick={()=>{
                        navigate("/administrator/userlist/user")
                    }}>View</a>
                    <Dropdown menu={{ items }}>
                        <a>More <DownOutlined /></a>
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const { loading: loadingMembers, 
            data: dataMembers, 
            error: errorMembers  } =  useQuery(   queryMembers, {
                                                context: { headers: getHeaders(location) },
                                                fetchPolicy: 'cache-first', 
                                                nextFetchPolicy: 'network-only', 
                                                notifyOnNetworkStatusChange: false,
                                            });

    useEffect(() => {
        if(!loadingMembers){
            if(!_.isEmpty(dataMembers?.members)){

                console.log("dataMembers?.members :", dataMembers?.members)

                setData([])
                setFilteredData([])
                if(dataMembers.members.status){
                    _.map(dataMembers.members.data, (e, key)=>{
                        
                        const newItem: DataType = {key, displayName: e.current.displayName, email: e.current.email, avatar: e.current.avatar?.url,  roles: e.current.roles, timestamp:e.updatedAt}; 
                        console.log("e :", e, newItem)
                        setData((prevItems) => {
                            if (Array.isArray(prevItems)) { // Check if prevItems is an array
                                return [...prevItems, newItem];
                            } else {
                                console.error('prevItems is not an array:', prevItems);
                                return [newItem]; // Fallback to ensure it is always an array
                            }
                        });

                        setFilteredData((prevItems) => {
                            if (Array.isArray(prevItems)) { // Check if prevItems is an array
                                return [...prevItems, newItem];
                            } else {
                                console.error('prevItems is not an array:', prevItems);
                                return [newItem]; // Fallback to ensure it is always an array
                            }
                        });
                    })
                }
            }
        }
    }, [dataMembers, loadingMembers])

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data.filter((item) => 
            item.user.toLowerCase().includes(value.toLowerCase()) ||
            item.filename.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

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
                pagination={{ pageSize: 50 }}
                rowKey="key"
            />
        </div>
    );
};

export default UserList;