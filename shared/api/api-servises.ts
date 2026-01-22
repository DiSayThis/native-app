import { createApi } from '../lib/axios';

import { AUTH_API, PARTNER_API, PROMOCODE_API, STUDENTS_API } from './urls';

export const studentsApi = createApi(STUDENTS_API);
export const promocodeApi = createApi(PROMOCODE_API);
export const partnerApi = createApi(PARTNER_API);
export const authApi = createApi(AUTH_API);
