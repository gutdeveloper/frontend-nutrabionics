import React, { useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Label } from '@/components/atoms/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { useCreateOrder } from '../../hooks/useCreateOrder';
import { X } from 'lucide-react';

interface CreateOrderFormProps {
  onOrderCreated: () => void;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onOrderCreated }) => {
  const {
    loading,
    products,
    selectedProduct,
    quantity,
    orderItems,
    total,
    setSelectedProduct,
    setQuantity,
    addItem,
    removeItem,
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
        <CardContent className="space-y-6">
          <div className="space-y-4">
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

            <Button
              type="button"
              onClick={addItem}
              disabled={!selectedProduct}
              className="w-full bg-[#3c2052] hover:bg-[#4a2a66] text-white"
              variant="default"
            >
              Agregar Producto
            </Button>
          </div>

          {orderItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Productos en la orden</h3>
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex-1">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">${item.product.price} x {item.quantity}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={loading || orderItems.length === 0} 
            className="w-full bg-[#3c2052] hover:bg-[#4a2a66] text-white"
            variant="default"
          >
            {loading ? 'Creando orden...' : 'Crear Orden'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}; 