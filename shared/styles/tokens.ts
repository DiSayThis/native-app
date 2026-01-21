export type ThemeName = 'light' | 'dark';

export type AppTheme = {
	name: ThemeName;
	colors: {
		// базовые
		bgWhite: string;
		textColor: string;
		bgGreen: string;
		bgBrown: string;
		bgYellow: string;
		bgPurple: string;
		success: string;
		error: string;
		gray: string;

		// используемые (derived)
		background: string;
		bgPrimary: string;
		bgSecondary: string;
		borderColor: string; // rgba
		labelColor: string;

		// hover (в RN hover почти не нужен; пригодится для web/desktop или pressed)
		hoverBgPrimary: string;
		hoverBgSecondary: string;
		hoverBgWhite: string;

		// акценты
		accentColor: string;
		accentHoverColor: string;
		accentTextColor: string;
		accentHoverTextColor: string;
	};

	typography: {
		// В RN fontSize — число (px), не rem.
		fontFamily: string;
		fontFamilyHeadings: string;
		fontSizeBase: number; // аналог 0.875rem при base 16 => 14
		fontSizeHeading: number;
		fontSizeButtons: number;
		headingsLetterSpacing: number; // 1px
		lineHeightBase: number; // "normal" в RN нет, задаем руками
	};
	radius: number;
	spacing: {
		// базовая шкала отступов (можно менять)
		x2: number; // 8
		x3: number; // 12
		x4: number; // 16
		x5: number; // 20
		x6: number; // 24
	};
};

const BaseColor = {
	bgWhite: '#f8f8f8',
	textColor: '#032c28',
	bgGreen: '#8fe248',
	bgBrown: '#f0e9e2',
	bgYellow: '#fee200',
	bgPurple: '#ffb9ff',
	success: '#16a34a',
	error: '#dc2626',
	gray: '#888',
};

const FontsSize = {
	f14: 14,
	f16: 16,
	f21: 20,
	f24: 24,
	f32: 32,
};

export const lightTheme: AppTheme = {
	name: 'light',
	colors: {
		...BaseColor,
		background: BaseColor.bgWhite,
		bgPrimary: BaseColor.bgGreen,
		bgSecondary: '#efefef',
		borderColor: 'rgba(0,0,0,0.2)',
		labelColor: BaseColor.gray,

		hoverBgPrimary: '#aaf46a',
		hoverBgSecondary: '#e0e0e0',
		hoverBgWhite: '#efefef',

		accentColor: BaseColor.bgGreen,
		accentHoverColor: '#aaf46a',
		accentTextColor: BaseColor.textColor,
		accentHoverTextColor: '#095851',
	},
	typography: {
		fontFamily: 'Mulish',
		fontFamilyHeadings: 'NunitoSans',
		fontSizeBase: FontsSize.f16, // 0.875rem * 16px
		fontSizeButtons: FontsSize.f16,
		fontSizeHeading: FontsSize.f24,
		headingsLetterSpacing: 1,
		lineHeightBase: 18, // под 14px обычно 18–20 комфортно
	},
	radius: 15,
	spacing: {
		x2: 8,
		x3: 12,
		x4: 16,
		x5: 20,
		x6: 24,
	},
};
