import {useTheme} from '@gluestack-ui/themed';
import {useAppColorMode} from '../features/components/ColorModeContext';
import {Dimensions} from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useAppColors = () => {
  const {colors} = useTheme();
  const {colorMode} = useAppColorMode();
  const isDarkMode = colorMode === 'dark';

  // Màu mặc định khi colors undefined
  const defaultColors = {
    white: '#FFFFFF',
    black: '#000000',
    sky: '#2567E8',
    primary0: '#F5F3FF',
    primary50: '#F5F3FF',
    primary100: '#DDD6FE',
    primary200: '#C4B5FD',
    primary300: '#A78BFA',
    primary400: '#8B5CF6',
    primary500: '#7C3AED',
    primary600: '#6D28D9',
    primary700: '#5B21B6',
    primary800: '#4C1D95',
    primary900: '#441e7d',
    primary950: '#441E7D',

    secondary0: '#FCFCFC',
    secondary50: '#f9fafb',
    secondary100: '#f3f4f6',
    secondary200: '#e4e7eb',
    secondary300: '#d1d5da',
    secondary400: '#9ca3af',
    secondary500: '#6b7280',
    secondary600: '#4b5563',
    secondary700: '#374151',
    secondary800: '#1f2937',
    secondary900: '#111827',
    secondary950: '#171717',

    backgroundDark0: '#FFFFFF',
    backgroundDark50: '#f9fafb',
    backgroundDark100: '#f3f4f6',
    backgroundDark200: '#e4e7eb',
    backgroundDark300: '#d1d5da',
    backgroundDark400: '#9ca3af',
    backgroundDark500: '#6b7280',
    backgroundDark600: '#4b5563',
    backgroundDark700: '#374151',
    backgroundDark800: '#1f2937',
    backgroundDark900: '#111827',
    backgroundDark950: '#171717',
    backgroundEditImageDark: 'rgba(0, 0, 0, 0.5)',

    backgroundLight0: '#FFFFFF',
    backgroundLight50: '#f9fafb',
    backgroundLight100: '#f3f4f6',
    backgroundLight200: '#e4e7eb',
    backgroundLight300: '#d1d5da',
    backgroundLight400: '#9ca3af',
    backgroundLight500: '#6b7280',
    backgroundLight600: '#4b5563',
    backgroundLight700: '#374151',
    backgroundLight800: '#1f2937',
    backgroundLight900: '#111827',
    backgroundLight950: '#171717',
    backgroundEditImageLight: 'rgba(196, 196, 196, 0.62)',

    backgroundLightError: '#FEF1F1',
    backgroundDarkError: '#2E2020',
    backgroundLightWarning: '#FFF4EB',
    backgroundDarkWarning: '#2E231B',
    backgroundLightSuccess: '#EDFCF2',
    backgroundDarkSuccess: '#1C2B21',
    backgroundLightInfo: '#EBF8FE',
    backgroundDarkInfo: '#1A282E',
    backgroundLightMuted: '#F6F6F7',
    backgroundDarkMuted: '#252526',
    backgroundDarkModal: '#262626',

    textLight0: '#FFFFFF',
    textLight50: '#f9fafb',
    textLight100: '#f3f4f6',
    textLight200: '#e4e7eb',
    textLight300: '#d1d5da',
    textLight400: '#9ca3af',
    textLight500: '#6b7280',
    textLight600: '#4b5563',
    textLight700: '#374151',
    textLight800: '#1f2937',
    textLight900: '#111827',
    textLight950: '#171717',

    textDark0: '#FFFFFF',
    textDark50: '#f9fafb',
    textDark100: '#f3f4f6',
    textDark200: '#e4e7eb',
    textDark300: '#d1d5da',
    textDark400: '#9ca3af',
    textDark500: '#6b7280',
    textDark600: '#4b5563',
    textDark700: '#374151',
    textDark800: '#1f2937',
    textDark900: '#111827',
    textDark950: '#171717',

    textSuccess0: '#FFFFFF',
    textSuccess50: '#ECFDF5',
    textSuccess100: '#D1FAE5',
    textSuccess200: '#A7F3D0',
    textSuccess300: '#6EE7B7',
    textSuccess400: '#34D399',
    textSuccess500: '#10B981',
    textSuccess600: '#059669',
    textSuccess700: '#047857',
    textSuccess800: '#065F46',
    textSuccess900: '#064E3B',
    textSuccess950: '#022C22',

    textError0: '#FFFFFF',
    textError50: '#FEF2F2',
    textError100: '#FEE2E2',
    textError200: '#FECACA',
    textError300: '#FCA5A5',
    textError400: '#F87171',
    textError500: '#EF4444',
    textError600: '#DC2626',
    textError700: '#B91C1C',
    textError800: '#991B1B',
    textError900: '#7F1D1D',
    textError950: '#450A0A',

    borderLight0: '#FFFFFF',
    borderLight50: '#f9fafb',
    borderLight100: '#f3f4f6',
    borderLight200: '#e4e7eb',
    borderLight300: '#d1d5da',
    borderLight400: '#9ca3af',
    borderLight500: '#6b7280',
    borderLight600: '#4b5563',
    borderLight700: '#374151',
    borderLight800: '#1f2937',
    borderLight900: '#111827',
    borderLight950: '#171717',

    borderDark0: '#FFFFFF',
    borderDark50: '#f9fafb',
    borderDark100: '#f3f4f6',
    borderDark200: '#e4e7eb',
    borderDark300: '#d1d5da',
    borderDark400: '#9ca3af',
    borderDark500: '#6b7280',
    borderDark600: '#4b5563',
    borderDark700: '#374151',
    borderDark800: '#1f2937',
    borderDark900: '#111827',
    borderDark950: '#171717',

    info50: '#F5F3FF',
    info100: '#DDD6FE',
    info200: '#C4B5FD',
    info300: '#A78BFA',
    info400: '#8B5CF6',
    info500: '#7C3AED',
    info600: '#6D28D9',
    info700: '#5B21B6',
    info800: '#4C1D95',
    info900: '#441e7d',
  };

  // Sử dụng colors từ theme nếu có, nếu không thì dùng màu mặc định
  const themeColors = colors || defaultColors;

  return {
    // Màu nền
    background: {
      primary: isDarkMode
        ? themeColors.backgroundDark900
        : themeColors.backgroundLight0,
      secondary: isDarkMode
        ? themeColors.backgroundDark800
        : themeColors.backgroundLight50,
      card: isDarkMode
        ? themeColors.backgroundDark800
        : themeColors.backgroundLight0,
      modal: isDarkMode
        ? themeColors.backgroundDarkModal
        : themeColors.backgroundLight0,
      interface_background: isDarkMode
        ? themeColors.backgroundDark800
        : themeColors.sky,
      edit_image: isDarkMode
        ? themeColors.backgroundEditImageDark
        : themeColors.backgroundEditImageLight,
    },

    // Màu chữ
    text: {
      primary: isDarkMode ? themeColors.textDark0 : themeColors.textLight900,
      secondary: isDarkMode
        ? themeColors.textDark400
        : themeColors.textLight500,
      muted: isDarkMode ? themeColors.textDark500 : themeColors.textLight400,
      inverse: isDarkMode ? themeColors.textLight0 : themeColors.textDark900,
      reverse: isDarkMode ? themeColors.textLight900 : themeColors.textDark0,
    },

    // Màu chính
    primary: {
      main: themeColors.sky,
      light: themeColors.primary400,
      dark: themeColors.primary600,
      background: isDarkMode ? themeColors.primary900 : themeColors.primary50,
    },

    // Màu phụ
    secondary: {
      main: themeColors.secondary500,
      light: themeColors.secondary400,
      dark: themeColors.secondary600,
      background: isDarkMode
        ? themeColors.secondary900
        : themeColors.secondary50,
    },

    // Màu input
    input: {
      background: isDarkMode
        ? themeColors.backgroundDark800
        : themeColors.backgroundLight0,
      text: isDarkMode ? themeColors.textDark0 : themeColors.textLight900,
      placeholder: isDarkMode
        ? themeColors.textDark400
        : themeColors.textLight400,
      border: isDarkMode
        ? themeColors.borderDark700
        : themeColors.borderLight200,
    },

    icon: {
      primary: isDarkMode ? themeColors.textDark0 : themeColors.textLight900,
      secondary: isDarkMode
        ? themeColors.textDark400
        : themeColors.textLight400,
    },

    // Màu button
    button: {
      primary: {
        background: themeColors.sky,
        text: themeColors.textLight0,
      },
      secondary: {
        background: isDarkMode
          ? themeColors.secondary700
          : themeColors.secondary200,
        text: isDarkMode ? themeColors.textDark0 : themeColors.textLight900,
      },
      outline: {
        border: isDarkMode
          ? themeColors.borderDark700
          : themeColors.borderLight200,
        text: isDarkMode ? themeColors.textDark0 : themeColors.textLight900,
      },
    },

    // Màu trạng thái
    status: {
      success: {
        background: isDarkMode
          ? themeColors.backgroundDarkSuccess
          : themeColors.backgroundLightSuccess,
        text: isDarkMode
          ? themeColors.textSuccess400
          : themeColors.textSuccess600,
      },
      error: {
        background: isDarkMode
          ? themeColors.backgroundDarkError
          : themeColors.backgroundLightError,
        text: isDarkMode ? themeColors.textError400 : themeColors.textError600,
      },
      warning: {
        background: isDarkMode
          ? themeColors.backgroundDarkWarning
          : themeColors.backgroundLightWarning,
        text: isDarkMode ? themeColors.textError400 : themeColors.textError600,
      },
      info: {
        background: isDarkMode
          ? themeColors.backgroundDarkInfo
          : themeColors.backgroundLightInfo,
        text: isDarkMode ? themeColors.info400 : themeColors.info600,
      },
    },

    // Màu border
    border: {
      light: isDarkMode
        ? themeColors.borderDark700
        : themeColors.borderLight200,
      dark: isDarkMode ? themeColors.borderDark800 : themeColors.borderLight300,
    },

    // Màu Tailwind
    tailwind: {
      white: '#FFFFFF',
      black: '#000000',
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#0D0D1B',
      },
      zinc: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
        950: '#09090b',
      },
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
      stone: {
        50: '#fafaf9',
        100: '#f5f5f4',
        200: '#e7e5e4',
        300: '#d6d3d1',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        700: '#44403c',
        800: '#292524',
        900: '#1c1917',
        950: '#0c0a09',
      },
      red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
      },
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
        950: '#431407',
      },
      amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
      },
      yellow: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
        950: '#422006',
      },
      lime: {
        50: '#f7fee7',
        100: '#ecfccb',
        200: '#d9f99d',
        300: '#bef264',
        400: '#a3e635',
        500: '#84cc16',
        600: '#65a30d',
        700: '#4d7c0f',
        800: '#3f6212',
        900: '#365314',
        950: '#1a2e05',
      },
      green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
      },
      emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#00E3AE',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        950: '#022c22',
      },
      teal: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
        950: '#042f2e',
      },
      cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
        950: '#083344',
      },
      sky: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#2567E8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      indigo: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
        950: '#1e1b4b',
      },
      violet: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
        950: '#2e1065',
      },
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
        950: '#3b0764',
      },
      fuchsia: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef',
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
        950: '#4a044e',
      },
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
        950: '#500724',
      },
      rose: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e',
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
        950: '#4c0519',
      },
    },
  };
};
