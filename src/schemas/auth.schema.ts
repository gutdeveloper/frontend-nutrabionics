import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es obligatorio' })
    .email({ message: 'Correo electrónico inválido' }),
  password: z
    .string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    .max(100, { message: 'La contraseña no debe exceder los 100 caracteres' }),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'El nombre debe tener al menos 2 caracteres' })
      .max(50, { message: 'El nombre no debe exceder los 50 caracteres' }),
    lastName: z
      .string()
      .min(2, { message: 'El apellido debe tener al menos 2 caracteres' })
      .max(50, { message: 'El apellido no debe exceder los 50 caracteres' }),
    email: z
      .string()
      .min(1, { message: 'El correo electrónico es obligatorio' })
      .email({ message: 'Correo electrónico inválido' }),
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .max(100, { message: 'La contraseña no debe exceder los 100 caracteres' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial',
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>; 