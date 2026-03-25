import type * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

type BrowserFile = Blob | File;

const stripDataUrlPrefix = (value: string): string => {
	const [prefix, base64] = value.split(',');

	if (prefix?.startsWith('data:')) {
		return base64 ?? '';
	}

	return value;
};

export const fileToBase64 = (file: BrowserFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result !== 'string') {
				reject(new Error('Не удалось обработать изображение'));
				return;
			}

			resolve(stripDataUrlPrefix(reader.result));
		};

		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(file);
	});

export async function documentPickerAssetToBase64(
	asset: DocumentPicker.DocumentPickerAsset,
): Promise<string> {
	if (asset.base64 && asset.base64.length > 0) {
		return stripDataUrlPrefix(asset.base64);
	}

	const webFile = (
		asset as DocumentPicker.DocumentPickerAsset & {
			file?: File;
		}
	).file;
	if (webFile) {
		return fileToBase64(webFile);
	}

	return FileSystem.readAsStringAsync(asset.uri, {
		encoding: FileSystem.EncodingType.Base64,
	});
}
