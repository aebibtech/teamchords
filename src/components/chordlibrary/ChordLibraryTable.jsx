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
    manualPagination: true, // Disables client-side pagination
  });

  return (
    <div className="flex flex-col">
      <div className="w-full overflow-x-auto flex-grow">
        <table className="w-full min-w-[600px] border border-gray-300 bg-white rounded-lg overflow-y-auto">
          <thead className="bg-gray-200 sticky top-0 z-10">
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
      <div className="flex justify-between items-center bg-white border-t sticky bottom-0">
        <button
          className="px-4 py-2 border rounded disabled:opacity-50"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ArrowLeft />
        </button>
        <span>
          Page <strong>{pageIndex + 1}</strong> of <strong>{totalPages}</strong>
        </span>
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
