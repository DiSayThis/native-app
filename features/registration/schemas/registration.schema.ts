import { z } from 'zod';

import { step1Schema } from './step1.schema';
import { step2Schema } from './step2.schema';
import { step3Schema } from './step3.schema';

export const registrationSchema = step1Schema.and(step2Schema).and(step3Schema);

export type RegistrationFormType = z.infer<typeof registrationSchema>;
