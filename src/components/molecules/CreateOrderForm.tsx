import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { useCreateOrder } from '../../hooks/useCreateOrder';

interface CreateOrderFormProps {
  onOrderCreated: () => void;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onOrderCreated }) => {
  const {
    loading,
    products,
    selectedProduct,
    quantity,
    total,
    setSelectedProduct,
    setQuantity,
    loadProducts,
    handleSubmit,
  } = useCreateOrder(onOrderCreated);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Orden</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Producto</Label>
            <Select
              value={selectedProduct?.id}
              onValueChange={(value) => {
                const product = products.find((p) => p.id === value);
                setSelectedProduct(product || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                type="button"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
                disabled={selectedProduct ? quantity >= selectedProduct.stock : true}
              >
                +
              </Button>
            </div>
          </div>

          {selectedProduct && (
            <div className="space-y-2">
              <Label>Total</Label>
              <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading || !selectedProduct} className="w-full">
            {loading ? 'Creando orden...' : 'Crear Orden'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}; 