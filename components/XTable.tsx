"use client";

import { useState, useEffect, useCallback } from "react";

interface Column {
  key: string;
  label?: string;
  id?: string;
}

interface PaginationData {
  page: number;
  count: number;
  total: number;
  prev?: string | null;
  next?: string | null;
}

interface ActionItem {
  label: string;
  icon?: string;
  click: () => void;
}

interface XTableProps {
  columns: Column[];
  tableData: Record<string, unknown>[];
  paginationData: PaginationData;
  itemsGenerator?: (row: Record<string, unknown>) => ActionItem[][];
  loading?: boolean;
  onPrevPage?: (url: string) => void;
  onNextPage?: (url: string) => void;
}

export function XTable({ columns, tableData, paginationData, itemsGenerator, loading, onPrevPage, onNextPage }: XTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const closeDropdown = useCallback(() => setOpenDropdownId(null), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown-container")) closeDropdown();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [closeDropdown]);

  const hasData = Array.isArray(tableData) && tableData.length > 0;

  return (
    <div className="flex flex-col w-full">
      <div className="w-full flex mb-4 justify-end">
        <div className="flex items-center gap-2">
          {paginationData.prev && (
            <button
              onClick={() => onPrevPage?.(paginationData.prev!)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              aria-label="Previous page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <span className="text-sm text-gray-600 px-3">Page {paginationData.page || 1} of {paginationData.count || 1}</span>
          {paginationData.next && (
            <button
              onClick={() => onNextPage?.(paginationData.next!)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              aria-label="Next page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto relative bg-white rounded-lg border border-gray-200">
        {loading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-lg">
            <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {hasData ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th key={col.id || col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label || col.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, rowIdx) => {
                const rowId = String(row._id ?? rowIdx);
                return (
                  <tr key={rowId} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.id || col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {col.key === "actions" && itemsGenerator ? (
                          <div className="relative dropdown-container">
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === rowId ? null : rowId)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                              aria-label="Actions"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            {openDropdownId === rowId && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                <div className="py-1">
                                  {itemsGenerator(row).map((group, gi) => (
                                    <div key={gi}>
                                      {group.map((item, ii) => (
                                        <button
                                          key={ii}
                                          onClick={() => { item.click(); closeDropdown(); }}
                                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                        >
                                          {item.icon?.includes("eye") && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                          )}
                                          {item.icon?.includes("trash") && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          )}
                                          {item.icon?.includes("clock") && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                          )}
                                          {item.label}
                                        </button>
                                      ))}
                                      {gi < itemsGenerator(row).length - 1 && <div className="border-t border-gray-100 my-1" />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span>{String(row[col.key] ?? "-")}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
            <p className="mt-1 text-sm text-gray-500">There are no records to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}
