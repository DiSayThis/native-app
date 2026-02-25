import { z } from 'zod';

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const russianNameRegex = /^[А-Яа-яЁё]+(?:[ \-''’ʼ]+[А-Яа-яЁё]+)*$/;

export const step2Schema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, 'Имя обязательно')
		.regex(russianNameRegex, 'Допустимы только русские буквы'),
	lastName: z
		.string()
		.trim()
		.min(1, 'Фамилия обязательна')
		.regex(russianNameRegex, 'Допустимы только русские буквы'),
	sex: z.boolean({ message: 'Выберите пол' }),
	birthDate: z
		.string()
		.trim()
		.min(1, 'Дата обязательна')
		.regex(isoDateRegex, 'Неверный формат даты (должно быть YYYY-MM-DD)')
		.transform((value) => {
			const [yyyy, mm, dd] = value.split('-').map(Number);
			const parsed = new Date(yyyy, mm - 1, dd);
			return { parsed, yyyy, mm, dd };
		})
		.refine(
			({ parsed, yyyy, mm, dd }) =>
				parsed.getFullYear() === yyyy && parsed.getMonth() === mm - 1 && parsed.getDate() === dd,
			'Несуществующая дата',
		)
		.refine(({ parsed }) => parsed <= new Date(), 'Дата из будущего недопустима')
		.refine(({ parsed }) => {
			const today = new Date();
			let age = today.getFullYear() - parsed.getFullYear();
			const m = today.getMonth() - parsed.getMonth();
			const d = today.getDate() - parsed.getDate();
			if (m < 0 || (m === 0 && d < 0)) age--;
			return age >= 14 && age <= 99;
		}, 'Возраст должен быть от 14 до 99 лет')
		.transform(({ parsed }) => parsed.toISOString().split('T')[0]),
});

export type Step2FormType = z.infer<typeof step2Schema>;
