import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    .max(100, { message: 'El nombre no debe exceder los 100 caracteres' }),
  description: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    .max(1000, { message: 'La descripción no debe exceder los 1000 caracteres' }),
  price: z
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .positive({ message: 'El precio debe ser un número positivo' })
    .multipleOf(0.01, { message: 'El precio debe tener máximo 2 decimales' }),
  quantity: z
    .number({ invalid_type_error: 'La cantidad debe ser un número' })
    .int({ message: 'La cantidad debe ser un número entero' })
    .nonnegative({ message: 'La cantidad no puede ser negativa' }),
  reference: z
    .string()
    .min(3, { message: 'La referencia debe tener al menos 3 caracteres' })
    .max(20, { message: 'La referencia no debe exceder los 20 caracteres' }),
});

export const productUpdateSchema = productSchema.partial();

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductUpdateFormValues = z.infer<typeof productUpdateSchema>; 