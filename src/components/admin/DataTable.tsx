"use client";

import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T | ((row: T) => string);
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField = "_id" as keyof T,
  loading = false,
  emptyMessage = "No records found.",
  className,
}: DataTableProps<T>) {
  const getKey = (row: T, index: number) => {
    if (typeof keyField === "function") return keyField(row);
    const value = row[keyField];
    return value != null ? String(value) : String(index);
  };

  if (loading) {
    return (
      <div className={cn("rounded-xl border border-champagne/40 bg-white overflow-hidden", className)}>
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-lake border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-champagne/40 bg-white overflow-hidden shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-midnight text-ivory">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left font-label text-xs uppercase tracking-wider font-semibold",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-champagne/30">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-midnight/50"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getKey(row, index)}
                  className="hover:bg-ivory/80 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("px-4 py-3 text-midnight", col.className)}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
