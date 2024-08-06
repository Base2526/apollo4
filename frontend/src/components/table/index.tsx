import React, { useEffect, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";

interface Column {
  Header: string;
  accessor: string;
}

interface TableCompProps {
  isDebug?: boolean;
  pageSize?: number;
  columns: Column[];
  data: any[];
  fetchData: (params: { pageIndex: number; pageSize: number; sortBy: any[]; searchOption: string; selectedOption: string }) => void;
  loading: boolean;
  pageCount: number;
}

const TableComp: React.FC<TableCompProps> = ({
  isDebug = false,
  pageSize: controlledPageSize = 50,
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}) => {
  const [searchOption, setSearchOption] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>(columns[0]?.Header || "");

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
    state: { pageIndex, pageSize, sortBy },
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
  }, [sortBy, fetchData, pageIndex, pageSize, searchOption, selectedOption]);

  return (
    <div>
      {isDebug && (
        <pre>
          <code>{JSON.stringify({ pageIndex, pageSize, controlledPageCount, canNextPage, canPreviousPage, searchOption, selectedOption }, null, 2)}</code>
        </pre>
      )}
      
      <div className="search-container">
        <input
          type="text"
          placeholder={`Search by ${selectedOption}...`}
          value={searchOption}
          onChange={e => setSearchOption(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedOption}
          onChange={e => {
            setSelectedOption(e.target.value);
            setSearchOption("");
          }}
          className="search-select"
        >
          {columns.map(({ Header }) => (
            <option key={Header} value={Header}>
              {Header}
            </option>
          ))}
        </select>
        {(selectedOption === columns[0]?.Header && searchOption === "") ? null : (
          <button className="reset-button" onClick={() => {
            setSearchOption("");
            setSelectedOption(columns[0]?.Header || "");
          }}>
            Reset
          </button>
        )}
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div colSpan={10000}>Showing {page.length} of ~{controlledPageCount * pageSize} results</div>
          <table {...getTableProps()} className="styled-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>{" "}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"}</button>{" "}
            <button onClick={() => nextPage()} disabled={!canNextPage}>{">"}</button>{" "}
            <button onClick={() => gotoPage(controlledPageCount - 1)} disabled={!canNextPage}>{">>"}</button>{" "}
            <span>Page <strong>{pageIndex + 1} of {pageOptions.length}</strong></span>
            <span>
              | Go to page:{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                style={{ width: "100px" }}
              />
            </span>{" "}
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[50, 100, 250, 500, 1000].map(size => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComp;