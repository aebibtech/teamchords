import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { deleteSetList, handlePreview, handleCopyLink } from "../../utils/setlists";
import { Eye, Trash, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SetListTable = ({ data }) => {
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    await deleteSetList(id);
    navigate("/setlists");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <Link to={`/setlists/${row.original.id}`} className="text-gray-500 underline hover:text-gray-600">
              {row.original.name}
            </Link>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Date Created",
        cell: ({ row }) => (
          <p>{new Date(row.original.created_at).toLocaleDateString()}</p>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-4">
            <button onClick={async () => await handlePreview(row.original.id)}><Eye size={16} /></button>
            <button onClick={async () => await handleCopyLink(row.original.id)}><Link2 size={16} /></button>
            <button onClick={async () => await handleDelete(row.original.id)}><Trash size={16} /></button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="h-[90vh] overflow-y-auto">
      <table className="w-full border border-gray-300 bg-white rounded-lg">
        <thead className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-b border-gray-300 p-3 text-left text-gray-700 font-medium cursor-pointer hover:bg-gray-300"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr key={row.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
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
  );
};

export default SetListTable;
    