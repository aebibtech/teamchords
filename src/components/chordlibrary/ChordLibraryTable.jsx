import React from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ChordLibraryTable = ({ data, pageIndex, setPageIndex, totalCount, pageSize }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const table = useReactTable({
    data,
    columns: [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <Link
            to={`/library/${row.original.id}`}
            className="text-gray-500 underline hover:text-gray-600"
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: "artist",
        header: "Artist",
      },
      {
        accessorKey: "key",
        header: "Key",
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, pageIndex - 2);
    let endPage = Math.min(totalPages - 1, pageIndex + 2);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 0) {
        endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(0, endPage - maxPagesToShow + 1);
      }
    }

    if (startPage > 0) {
      pageNumbers.push(
        <button key="first" className="px-3 py-1 border rounded mx-1" onClick={() => setPageIndex(0)}>1</button>
      );
      if (startPage > 1) {
        pageNumbers.push(<span key="dots-start">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 border rounded mx-1 ${pageIndex === i ? "bg-gray-300" : "bg-white"}`}
          onClick={() => setPageIndex(i)}
        >
          {i + 1}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pageNumbers.push(<span key="dots-end">...</span>);
      }
      pageNumbers.push(
        <button key="last" className="px-3 py-1 border rounded mx-1" onClick={() => setPageIndex(totalPages - 1)}>
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full overflow-x-auto flex-grow">
        <table className="w-full min-w-[600px] border border-gray-300 bg-white rounded-lg">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-gray-300 p-3 text-left text-gray-700 font-medium"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-gray-200 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center bg-white border-t sticky bottom-10 md:bottom-0 p-3">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ArrowLeft />
        </button>
        <div className="flex mx-2 hidden sm:inline-block">{renderPageNumbers()}</div>
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex >= totalPages - 1}
        >
          <ArrowRight />
        </button>
      </div>
    </div>
  );
};

export default ChordLibraryTable;
