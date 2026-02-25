import { z } from 'zod';

const passwordRegex = {
	upper: /[A-ZА-ЯЁ]/,
	lower: /[a-zа-яё]/,
	digit: /\d/,
	special: /[^A-Za-zА-Яа-я0-9Ёё]/,
};

export const step1Schema = z
	.object({
		email: z.string().trim().email('Введите корректный email'),
		password: z
			.string()
			.trim()
			.min(8, 'Пароль должен быть минимум 8 символов')
			.refine(
				(v) =>
					passwordRegex.upper.test(v) &&
					passwordRegex.lower.test(v) &&
					passwordRegex.digit.test(v) &&
					passwordRegex.special.test(v),
				{
					message:
						'Пароль должен состоять из заглавных и строчных букв, цифр и одного специального символа',
				},
			),
		confirmPassword: z.string().trim(),
		promocode: z.string().trim().optional(),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password !== confirmPassword) {
			ctx.addIssue({
				code: 'custom',
				message: 'Пароли не совпадают',
				path: ['confirmPassword'],
			});
		}
	});

export type Step1FormType = z.infer<typeof step1Schema>;
