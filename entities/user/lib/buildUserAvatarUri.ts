import { FILE_API } from '@/shared/api/urls';

export function buildUserAvatarUri(studentId: string, version?: number) {
	return `${FILE_API}/Avatars/${studentId}?t=${version ?? 0}`;
}
