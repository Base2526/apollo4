import React, { useEffect, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";

const TableComp = (props) => {
    const { isDebug= false, pageSize: controlledPageSize = 50, columns, data, fetchData, loading, pageCount: controlledPageCount } = props

    const [searchOption, setSearchOption]     = useState( "" );
    const [selectedOption, setSelectedOption] = useState( columns.map(({ Header }) => Header)[0] );

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize, sortBy }
    } = useTable(
      {
        columns,
        data,
        manualPagination: true,
        manualSortBy: true,
        autoResetPage: false,
        autoResetSortBy: false,
        pageCount: controlledPageCount,
        initialState: { pageSize: controlledPageSize },
      },
      useSortBy,
      usePagination
    );
  
    useEffect(() => {
      fetchData({ pageIndex, pageSize, sortBy, searchOption, selectedOption });
    }, [ sortBy, fetchData, pageIndex, pageSize, searchOption, selectedOption ]);
  
    return (
      <div>
        {
          isDebug
          ? <pre>
              <code>{ JSON.stringify({ pageIndex, pageSize, controlledPageCount, canNextPage, canPreviousPage, searchOption, selectedOption }, null, 2 ) } </code>
            </pre>
          : <></>
        }
        <div>
          <input
            type="text"
            placeholder={`Search by ${selectedOption}...`}
            value={searchOption}
            onChange={e => setSearchOption(e.target.value)}
            style={{ marginBottom: "20px", padding: "10px", width: "200px" }}/>
          <select 
            defaultValue={columns.map(({ Header }) => Header)[0]}
            value={selectedOption} // ...force the select's value to match the state variable...
            onChange={e =>{
              setSelectedOption(e.target.value)
              setSearchOption("")
            } } >
            {
                columns.map(({ Header }) => Header).map((val, index)=>{ return <option key={index} value={val}>{val}</option> })
            }
          </select>
          {
            selectedOption === columns.map(({ Header }) => Header)[0] && searchOption === ""
            ? <></>
            : <button onClick={()=>{
                setSearchOption("");
                setSelectedOption(columns.map(({ Header }) => Header)[0]);
              }}>Reset</button>
          }
          
        </div>
        {
          loading 
          ? <div>Loading...</div>
          : <div>
              <div colSpan="10000">Showing {page.length} of ~{controlledPageCount * pageSize}{" "} results </div>
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render("Header")}
                          {/* Add a sort direction indicator */}
                          <span>
                            { 
                              column.isSorted
                              ? column.isSortedDesc ? " 🔽" : " 🔼"
                              : ""
                            }
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>{" "}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}> {"<"} </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}> {">"} </button>{" "}
                <button onClick={() => gotoPage(controlledPageCount - 1)} disabled={!canNextPage}> {">>"} </button>{" "}
                <span>Page{" "} <strong> {pageIndex + 1} of {pageOptions.length} </strong>{" "}</span>
                <span>
                  | Go to page:{" "}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;
                      gotoPage(page);
                    }}
                    style={{ width: "100px" }}
                  />
                </span>{" "}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[50, 100, 250, 500, 1000].map((pageSize) => ( <option key={pageSize} value={pageSize}> Show {pageSize} </option> ))}
                </select>
              </div>
            </div>
        }
      </div>
    );
}

export default TableComp;