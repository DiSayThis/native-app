import { z } from 'zod';

import type { RegistrationFile } from '../model/registration.dto';

const MAX_FILE_MB = 20;
const MAX_SIZE = MAX_FILE_MB * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const russianNameRegex = /^[А-Яа-яЁё]+(?:[ \-''’ʼ]+[А-Яа-яЁё]+)*$/;

export const step3Schema = z.object({
	specialisation: z
		.string()
		.trim()
		.min(1, 'Специализация обязательна')
		.regex(russianNameRegex, 'Допустимы только русские буквы'),
	universityId: z.number({ message: 'Университет обязателен' }),
	courseId: z.number({ message: 'Курс обязателен' }),
	file: z
		.custom<RegistrationFile | undefined>()
		.refine((file) => !file || (file.size ?? 0) <= MAX_SIZE, {
			message: `Размер не должен превышать ${MAX_FILE_MB} МБ`,
		})
		.refine((file) => !file || ALLOWED_TYPES.includes(file.mimeType ?? ''), {
			message: 'Допустимые форматы: JPG, PNG, WEBP',
		}),
	consent: z
		.boolean({ message: 'Согласие обязательно' })
		.refine((consent) => !!consent, 'Согласие обязательно'),
});

export type Step3FormType = z.infer<typeof step3Schema>;
