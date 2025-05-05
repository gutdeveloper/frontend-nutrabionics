import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../atoms/Table';
import { Pagination } from './Pagination';

export interface Header {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface DataTableProps {
  headers: Header[];
  data: any[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-4">No hay datos disponibles</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.key}>{header.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={header.key}>
                  {header.render
                    ? header.render(item[header.key], item)
                    : item[header.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}; 