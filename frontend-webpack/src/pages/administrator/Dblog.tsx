import React, { useState, useEffect } from 'react';
import { Table, Input } from 'antd';
import { useQuery } from "@apollo/client";
import _ from "lodash"
import { useLocation } from "react-router-dom";
import moment from "moment";
import { queryDblog } from "../../apollo/gqlQuery"
import { getHeaders } from "../../utils"
import ObjectView from '../../utils/ObjectView';

interface DataType {
    key: string;
    level: string;
    message: string;
    meta: any;
    timestamp: string;
}

const columns = [
    {
        title: 'Level',
        dataIndex: 'level',
        // sorter: (a: DataType, b: DataType) => a.name.localeCompare(b.name),
    },
    {
        title: 'Message',
        dataIndex: 'message',
    },
    {
        title: 'Meta',
        dataIndex: 'meta',
        // sorter: (a: DataType, b: DataType) => a.address.localeCompare(b.address),
        render: (meta: any) =>{
            try {
                return <ObjectView  data={meta} />
            }catch (error) {
                return <div>{meta}</div>
            }
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
];

const Dblog: React.FC = () => {
    const location = useLocation();
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<DataType[]>();
    const [data, setData] = useState<DataType[]>();

    const { loading: loadingDblog, 
        data: dataDblog, 
        error: errorDblog  } =  useQuery( queryDblog, {
                                            context: { headers: getHeaders(location) },
                                            fetchPolicy: 'cache-first', 
                                            nextFetchPolicy: 'network-only', 
                                            notifyOnNetworkStatusChange: false,
                                          });

    useEffect(() => {
        if(!loadingDblog){
            if(!_.isEmpty(dataDblog?.dblog)){
                if(dataDblog.dblog.status){
                    _.map(dataDblog.dblog.data, (e, key)=>{
                        const newItem: DataType = {key, level: e.level, message: e.message, meta: e.meta, timestamp:e.timestamp};
                        
                        console.log("e :", e)
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

                        // setDatas(_.sortBy(newData, "timestamp").reverse())
                    })
                }
            }
        }
    }, [dataDblog, loadingDblog])

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data?.filter((item) => 
            item.message.toLowerCase().includes(value.toLowerCase()) ||
            item.meta.toLowerCase().includes(value.toLowerCase())
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
                columns={columns}
                dataSource={filteredData}
                pagination={{ pageSize: 50 }}
                rowKey="key"
            />
        </div>
    );
};

export default Dblog;