import React from 'react';
import { format } from 'date-fns';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  products: Product[];
  total: number;
  quantity_products: number;
  createdAt: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface OrderDetailsTableProps {
  order: Order;
}

export const OrderDetailsTable: React.FC<OrderDetailsTableProps> = ({ order }) => {
  return (
    <div className="mt-4">
      <div className="mb-4">
        <p className="font-semibold">Fecha: {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</p>
        <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
        {order.user && (
          <p className="font-semibold">
            Cliente: {order.user.firstName} {order.user.lastName}
          </p>
        )}
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {order.products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">${product.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 