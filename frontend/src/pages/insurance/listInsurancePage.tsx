import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { Avatar } from "@mui/material"; // Adjust based on your library
import _ from "lodash";
import moment from "moment"; // Adjust based on your date library
import { useNavigate } from 'react-router-dom';

import "./index.less"

import TableComp from '../../components/table'; // Assuming the TableComp is in the same directory


interface FetchDataParams {
    pageSize: number;
    pageIndex: number;
    sortBy: { id: string; desc: boolean }[]; // Adjust this type based on the structure of your sortBy data
    searchOption: string;
    selectedOption: string;
}

interface DataItem {
    current: {
      displayName?: string | undefined;
      email?: string | undefined;
      avatar?: any | undefined;
      lastAccess?: string | undefined;
      // Add other fields as necessary based on your data structure
    };
}

const MyComponent = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageCount, setPageCount] = useState<number>(0);
    const fetchIdRef = useRef<number>(0);
    const sortIdRef = useRef<number>(0);
    const [serverData, setServerData] = useState<DataItem[]>([]);

    const columns = useMemo(
        () => [
        {
            Header: 'Image',
            accessor: 'avatar',
            Cell: (props: any) => {
            const { original } = props.row;
            return (
                <div>
                <Avatar
                    alt="Avatar"
                    variant="rounded"
                    src={_.isEmpty(original?.current?.avatar) ? "" : original?.current?.avatar?.url}
                    sx={{ width: 56, height: 56 }}
                />
                </div>
            );
            },
            disableSortBy: true,
        },
        {
            Header: 'Display name',
            accessor: 'displayName',
            Cell: (props: any) => {
            const { original } = props.row;
            return <div>{original?.current?.displayName}</div>;
            },
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: (props: any) => {
            const { original } = props.row;
            return <div>{original?.current?.email}</div>;
            },
        },
        {
            Header: 'Last access',
            accessor: 'lastAccess',
            Cell: (props: any) => {
            const { original } = props.row;
            // Add your date formatting logic here
            return <div>{original?.current?.lastAccess}</div>;
            },
        },
        {
            Header: 'Edit',
            Cell: (props: any) => {
            const { original } = props.row;
            return (
                <button onClick={() => { 
                    // 
                    navigate("/detailnsurance") 
                 }}>
                Edit
                </button>
            );
            },
            disableSortBy: true,
        },
        ],
        []
    );

    useEffect(()=>{
        setServerData(
            [
                {
                    current:{
                        displayName: "ชนะ วรรณสันทัด",
                        email: "a1@local.ls",
                        avatar:{
                            url: ""
                        },
                        lastAccess: ""
                    }
                },
                {
                    current:{
                        displayName: "ขวัญตา เสียงกลางมุกดา",
                        email: "a2@local.ls",
                        avatar:{
                            url: ""
                        },
                        lastAccess: ""
                    }
                },
                {
                    current:{
                        displayName: "มนะชัย อิงสุรารักษ์",
                        email: "a3@local.ls",
                        avatar:{
                            url: ""
                        },
                        lastAccess: ""
                    }
                },
                {
                    current:{
                        displayName: "เทียมจิต ฉันทวิลาศ",
                        email: "a4@local.ls",
                        avatar:{
                            url: ""
                        },
                        lastAccess: ""
                    }
                }
            ]
        )
    }, [])

    const fetchData = useCallback((el: FetchDataParams) => {
        const { pageSize, pageIndex, sortBy, searchOption, selectedOption } = el;
        const fetchId = ++fetchIdRef.current;
    
        setLoading(true);
        setTimeout(() => {
            if (fetchId === fetchIdRef.current) {
                let sortedData = [...serverData]; // Create a shallow copy of serverData
        
                // Filter data based on searchOption
                if (!_.isEmpty(searchOption)) {
                    const searchOptionLower = searchOption.toLowerCase();
                    sortedData = sortedData.filter((item) => {
                        switch (selectedOption) {
                            case "Display name":
                                return item?.current?.displayName?.toLowerCase().includes(searchOptionLower);
                            case "Email":
                                return item?.current?.email?.toLowerCase().includes(searchOptionLower);
                            default:
                                return true; // Return all if no matching case
                        }
                    });
                }
        
                // Apply sorting if sortBy is defined
                if (sortBy.length > 0) {
                    // sortedData.sort((a, b) => {
                    //     for (const { id, desc } of sortBy) {
                    //         const modifier = desc ? -1 : 1;
                    //         if (a?.current[id] > b?.current[id]) return modifier;
                    //         if (a?.current[id] < b?.current[id]) return -modifier;
                    //     }
                    //     return 0;
                    // });
                    sortedData.sort((a, b) => {
                        for (const { id, desc } of sortBy) {
                          const modifier = desc ? -1 : 1;
                          const valueA = a.current[id];
                          const valueB = b.current[id];
            
                          if (typeof valueA === 'string' && typeof valueB === 'string') {
                            const result = valueA.localeCompare(valueB);
                            if (result !== 0) return modifier * result;
                          } else if (valueA > valueB) return modifier;
                          else if (valueA < valueB) return -modifier;
                        }
                        return 0;
                    });
                }
        
                const startRow = pageSize * pageIndex;
                const endRow = startRow + pageSize;
                setData(sortedData.slice(startRow, endRow));
                setPageCount(Math.ceil(sortedData.length / pageSize));
                setLoading(false);
            }
        }, 1000);
    }, [serverData]);

    return (
        <div className="wrapper">
            <TableComp
                columns={columns}
                data={data}
                fetchData={fetchData}
                loading={false} // Set loading state as needed
                pageCount={0} // Set the page count as needed
            />
        </div>
    );
};

export default MyComponent;