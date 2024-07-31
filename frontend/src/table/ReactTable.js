import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import _ from "lodash";
import styled from "styled-components";

import makeData from "./makeData";
import TableComponent from "./TableComponent"

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

// Let's simulate a large dataset on the server (outside of our component)
const serverData = makeData(100);

const ReactTable = (props) => {
    const [data, setData]           = useState([]);
    const [loading, setLoading]     = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef                = useRef(0);
    const sortIdRef                 = useRef(0);

    const columns = useMemo(
        () => [
          // {
          //   Header: 'Name',
          //   columns: [
        { Header: "ID", accessor: "id" },
          {
            Header: "First Name",
            accessor: "firstName",
          },
          {
            Header: "Last Name",
            accessor: "lastName",
          },
          //   ],
          // },
          // {
          // Header: 'Info',
          // columns: [
          {
            Header: "Age",
            accessor: "age",
          },
          {
            Header: "Visits",
            accessor: "visits",
          },
          {
            Header: "Status",
            accessor: "status",
          },
          {
            Header: "Profile Progress",
            accessor: "progress",
          },
          // ],
          // },
        ],
        []
    );

    const fetchData = useCallback((el) => {
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
                            case "ID":
                                return item.id.toString().includes(searchOption);
                            case "First Name":
                                return item.firstName.toLowerCase().includes(searchOptionLower);
                            case "Last Name":
                                return item.lastName.toLowerCase().includes(searchOptionLower);
                            case "Age":
                                return item.age.toString().includes(searchOption);
                            case "Visits":
                                return item.visits.toString().includes(searchOption);
                            case "Status":
                                return item.status.toLowerCase().includes(searchOptionLower);
                            case "Profile Progress":
                                return item.progress.toString().includes(searchOption);
                            default:
                                return true; // Return all if no matching case
                        }
                    });
                }
    
                // Apply sorting if sortBy is defined
                if (sortBy.length > 0) {
                    sortedData.sort((a, b) => {
                        for (const { id, desc } of sortBy) {
                            const modifier = desc ? -1 : 1;
                            if (a[id] > b[id]) return modifier;
                            if (a[id] < b[id]) return -modifier;
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
    }, []);

    const handleSort = useCallback(( el ) => {
        let { sortBy } = el
        // Simply call fetchData to trigger re-fetching the data with sorting
        fetchData({ pageSize: 10, pageIndex: 0, sortBy });
    }, [fetchData] );
    
    return (<Styles>
                <TableComponent
                    columns={columns}
                    data={data}
                    onSort={handleSort}
                    fetchData={fetchData}
                    loading={loading}
                    pageCount={pageCount}/>
            </Styles>);
}

export default ReactTable;