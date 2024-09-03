import React, { useState, useEffect } from 'react';
import { Table, Input, Tag } from 'antd';
import moment from "moment";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import _ from "lodash"

import { queryFiles, mutationTest_upload } from "../../apollo/gqlQuery"
import { getHeaders } from "../../utils"

import AttackFileField from "../../components/basic/attack-file";

interface DataType {
    key: string;
    user: string;
    path: string;
    filename: string;
    mimetype: string;
    encoding: string;
    timestamp: any;
}

const columns = [
    {
        title: 'User',
        dataIndex: 'user',
        sorter: (a: DataType, b: DataType) => a.user.localeCompare(b.user),
        render: (user: string) =>{
            return <Link to={"/"}><Tag color="#2db7f5">{user}</Tag></Link>
        }
    },
    {
        title: 'Path',
        dataIndex: 'path',
        sorter: (a: DataType, b: DataType) => a.path.localeCompare(b.path),
        render: (path: string) =>{
            let newPath = window.location.protocol +'//'+ window.location.hostname + ':4000/' + path
            return <a href={newPath} target="_blank" rel="noopener noreferrer">{ path }</a>
        }
    },
    {
        title: 'Filename',
        dataIndex: 'filename',
        sorter: (a: DataType, b: DataType) => a.filename.localeCompare(b.filename),
    },
    {
        title: 'Mimetype',
        dataIndex: 'mimetype',
        sorter: (a: DataType, b: DataType) => a.mimetype.localeCompare(b.mimetype),
    },
    {
        title: 'Encoding',
        dataIndex: 'encoding',
        sorter: (a: DataType, b: DataType) => a.encoding.localeCompare(b.encoding),
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

const data: DataType[] = [
    {
        key: '1',
        user: "@a",
        path: "/xxx/aa.png",
        filename: 'aa.png',
        mimetype: 'aa',
        encoding: 'aa',
        timestamp: moment()
    }
];

const FileList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<DataType[]>();
    const [data, setData] = useState<DataType[]>();

    const [files, setFiles] = useState<File[]>([]);

    // const [onMutationTest_upload, resultTest_upload] = useMutation(mutationTest_upload, {
    //     context: { headers: getHeaders(location) },
    //     update: (cache, {data: {test_upload}}) => {
    //         console.log("update :", test_upload)
    //     },
    //     onCompleted(data) {
    //         console.log("onCompleted :", data)
    //     },
    //     onError(error){
    //         console.log("onError :", error)
    //     }
    // });

    const { loading: loadingFiles, 
            data: dataFiles, 
            error: errorFiles  } =  useQuery( queryFiles, {
                                                context: { headers: getHeaders(location) },
                                                fetchPolicy: 'cache-first', 
                                                nextFetchPolicy: 'network-only', 
                                                notifyOnNetworkStatusChange: false,
                                            });

    useEffect(() => {
        if(!loadingFiles){
            if(!_.isEmpty(dataFiles?.files)){
                setData([])
                setFilteredData([])
                if(dataFiles.files.status){
                    _.map(dataFiles.files.data, (e, key)=>{
                        console.log("e :", e?.creator)
                        const newItem: DataType = {key, user: e?.creator?.current?.displayName, path: e.url, filename: e.filename, mimetype: e.mimetype, encoding: e.encoding, timestamp:e.createdAt}; 
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
    }, [dataFiles, loadingFiles])

    const handleSearch = (value: string) => {
        setSearchText(value);
        const filtered = data?.filter((item) => 
            item.user.toLowerCase().includes(value.toLowerCase()) ||
            item.filename.toLowerCase().includes(value.toLowerCase())
        ) || [];
        setFilteredData(filtered);
    };

    // const attack = () =>{
    //     return  <div>
    //                 <AttackFileField
    //                     label={"attack_file"}
    //                     values={files}
    //                     multiple={true}
    //                     required={true}
    //                     onChange={(values) => {
    //                         setFiles(values)
    //                     }}
    //                     onSnackbar={(data) => {
    //                         // setSnackbar(data);
    //                     }}/>
    //                 <button 
    //                     disabled={ _.isEmpty(files) ? true : false } 
    //                     onClick={()=>{ onMutationTest_upload({ variables: { input: { files } } }) }}>Test upload</button>
    //             </div>
    // }

    return (
        <div>
            {/* { attack() } */}
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

export default FileList;