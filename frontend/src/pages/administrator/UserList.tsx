import React, { useState, useEffect } from 'react';
import { Table, Input, Menu, Button, Space, Dropdown, Image, Avatar, Tag } from 'antd';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import _ from "lodash"
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { query_members, query_positions } from "@/apollo/gqlQuery"
import { getHeaders, getPositionId } from "@/utils"

const { REACT_APP_HOST_GRAPHAL }  = process.env

interface DataType {
    _id: string;
    current:{
        displayName: string;
        email: string;
    }
}

interface MenuItem {
    key: string;
    label: string;
}

const menuItems: MenuItem[] = [
    { key: '1', label: 'Edit' },
    { key: '2', label: 'Delete' },
];

interface positionInterface {
    _id: string;
    level: number;
    name: string;
    percent: number;
    budget: number;
}

const columns = (navigate: ReturnType<typeof useNavigate>, positions: positionInterface[]) => [
    {
        title: 'Avatar',
        dataIndex: ['current' ,'avatar'],
        render:(avatar: any)=>{
            return _.isEmpty(avatar) 
                    ? <Avatar 
                        className="user-avator" 
                        shape="square"
                        size={100} 
                        icon={<UserOutlined />}/>
                    : <Image  width={100} src={`http://${REACT_APP_HOST_GRAPHAL}/` + avatar.url} /> 
        }
    },
    {
        title: 'User',
        dataIndex: ['current', 'displayName'],
        // sorter: (a: DataType, b: DataType) => a.displayName.localeCompare(b.displayName),
        render: (displayName: string) =>{
            return <>{displayName}</>
        }
    },
    {
        title: 'Email',
        dataIndex: ['current', 'email'],
        sorter: (a: DataType, b: DataType) => a.current.email.localeCompare(b.current.email),
        render: (email: string) =>{
            return <>{email}</>
        }
    },
    {
        title: 'ตำแหน่ง',
        dataIndex: ['current', 'positionIds'],
        render: (positionIds: any[]) =>{
            let positionId = getPositionId(positionIds);
            let position = _.find(positions, (p)=>p._id?.toString() === positionId?.toString())
            return <Tag color="#2db7f5">{position?.name}</Tag>
        }
    },
    // {
    //     title: 'Date',
    //     dataIndex: 'timestamp',
    //     // sorter: (a: DataType, b: DataType) => a.address.localeCompare(b.address),
    //     render: (timestamp: string) =>{
    //         return <div>{(moment(new Date(timestamp), 'YYYY-MM-DD HH:mm')).format('MMMM Do YYYY, h:mm:ss a')}</div>
    //     }
    // },
    {
        title: 'Action',
        key: 'action',
        sorter: true,
        render: (item: any) => {
            return  <Space size="middle">
                        <a onClick={()=>{
                            navigate(`/administrator/userlist/user?mode=view&v=${item._id}`, { state: { mode: 'view', _id: item._id } });
                        }}>View</a>
                        <a onClick={()=>{
                            navigate("/administrator/userlist/tree")
                        }}>Tree</a>
                        <Dropdown
                            overlay={() => (
                                <Menu
                                    onClick={(e) => {
                                        if (e.key === '1') {
                                            navigate(`/administrator/userlist/user?mode=edited&v=${item._id}`, { state: { mode: 'edited', _id: item._id } });
                                        } else if (e.key === '2') {
                                            // onDelete(data);
                                        }
                                    }}
                                >
                                    {menuItems.map((item) => (
                                        <Menu.Item key={item.key}>{item.label}</Menu.Item>
                                    ))}
                                </Menu>
                            )}
                            trigger={['hover']}
                        >
                            <Button type="link">
                                More <DownOutlined />
                            </Button>
                        </Dropdown>
                    </Space>
        }
    },
];

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<DataType[]>();
    const [data, setData] = useState<DataType[]>();
    const [files, setFiles] = useState<File[]>([]);
    const { profile } = useSelector((state: any) => state.user);

    const [positions, setPositions] = useState<positionInterface[]>([]);

    const { loading: loadingPositions, data: dataPositions } = useQuery(query_positions, {
        context: { headers: getHeaders(location) },
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'network-only'
    });

    useEffect(() => {
        if (!loadingPositions && !_.isEmpty(dataPositions?.positions)) {
            const { status, data } = dataPositions.positions;
            if (status) {
                setPositions(data);
            }
        }
    }, [dataPositions, loadingPositions]);

    const { loading: loadingMembers, 
            data: dataMembers, 
            error: errorMembers  } =  useQuery( query_members, 
                                                {
                                                    context: { headers: getHeaders(location) },
                                                    fetchPolicy: 'cache-first', 
                                                    nextFetchPolicy: 'network-only', 
                                                    notifyOnNetworkStatusChange: false,
                                                });

    useEffect(() => {
        if(!loadingMembers){
            if(!_.isEmpty(dataMembers?.members)){
                setData([])
                setFilteredData([])
                if(dataMembers.members.status){
                    // console.log("dataMembers.members.data :", dataMembers.members.data)
                    _.map(dataMembers.members.data, (e, key)=>{
                        setData((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
                        setFilteredData((prevItems) => Array.isArray(prevItems) ? [...prevItems, e] : [e]);
                    })
                }
            }
        }
    }, [dataMembers, loadingMembers])

    // useEffect(()=>{
    //     console.log("filteredData :", filteredData)
    // }, [filteredData])

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data?.filter((item ) => 
        {
            return item.current.displayName.toLowerCase().includes(value.toLowerCase())
        } 
        ) || [];
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
                columns={columns(navigate, positions)}
                dataSource={filteredData}
                pagination={{ pageSize: 50 }}
                rowKey="key"
            />
        </div>
    );
};

export default UserList;