import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyText?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

export function Table<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyText = 'No records found.',
  pagination,
  className = '',
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-hidden glass-card rounded-3xl ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`
                    py-3.5 px-4 sm:px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    ${col.className || ''}
                  `}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4 sm:px-6">
                      <div className="h-4 bg-slate-200/60 dark:bg-slate-800/60 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`
                        py-4 px-4 sm:px-6 text-sm text-slate-800 dark:text-slate-200 font-medium
                        ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                        ${col.className || ''}
                      `}
                    >
                      {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Page <strong className="text-slate-900 dark:text-slate-100">{pagination.currentPage}</strong> of{' '}
            <strong className="text-slate-900 dark:text-slate-100">{pagination.totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
