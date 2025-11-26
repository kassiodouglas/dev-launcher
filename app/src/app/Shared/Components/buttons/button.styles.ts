export type ButtonVariant =
  | 'primary' | 'soft-primary'
  | 'secondary' | 'soft-secondary'
  | 'success' | 'soft-success'
  | 'danger' | 'soft-danger'
  | 'info' | 'soft-info'
  | 'warn' | 'soft-warn'
  | 'black' | 'soft-black'
  | 'white' | 'soft-white'
  | 'accent-teal' | 'accent-violet'
  | 'transparent';

export const ButtonStyles: Record<ButtonVariant, string> = {
  // 💠 PRIMARY
  primary: '!bg-primary-400 !text-primary-950 dark:!bg-primary-700 dark:!text-white dark:hover:!bg-primary-800',
  'soft-primary': '!bg-primary-100 !text-primary-900 dark:!bg-primary-900 dark:!text-primary-100 dark:hover:!bg-primary-800',

  // 💎 SECONDARY
  secondary: '!bg-secondary-400 !text-secondary-950 dark:!bg-secondary-700 dark:!text-white dark:hover:!bg-secondary-800',
  'soft-secondary': '!bg-secondary-100 !text-secondary-900 dark:!bg-secondary-900 dark:!text-secondary-100 dark:hover:!bg-secondary-800',

  // ✅ SUCCESS
  success: '!bg-green-400 !text-green-950 dark:!bg-green-600 dark:!text-gray-50 dark:hover:!bg-green-800',
  'soft-success': '!bg-green-100 !text-green-900 dark:!bg-green-900 dark:!text-green-100 dark:hover:!bg-green-800',

  // ❌ DANGER
  danger: '!bg-red-400 !text-red-950 dark:!bg-red-600 dark:!text-gray-50 dark:hover:!bg-red-800',
  'soft-danger': '!bg-red-100 !text-red-900 dark:!bg-red-900 dark:!text-red-100 dark:hover:!bg-red-800',

  // ℹ️ INFO
  info: '!bg-blue-400 !text-blue-950 dark:!bg-blue-600 dark:!text-gray-100 dark:hover:!bg-blue-800',
  'soft-info': '!bg-blue-100 !text-blue-900 dark:!bg-blue-900 dark:!text-blue-100 dark:hover:!bg-blue-800',

  // ⚠️ WARN
  warn: '!bg-yellow-400 !text-yellow-950 dark:!bg-yellow-600 dark:!text-gray-100 dark:hover:!bg-yellow-800',
  'soft-warn': '!bg-yellow-100 !text-yellow-950 dark:!bg-yellow-900 dark:!text-yellow-100 dark:hover:!bg-yellow-800',

  // 🖤 BLACK
  black: '!bg-black !text-white dark:!bg-zinc-900 dark:!text-gray-100 dark:hover:!bg-zinc-800',
  'soft-black': '!bg-zinc-200 !text-zinc-900 dark:!bg-zinc-800 dark:!text-gray-200 dark:hover:!bg-zinc-700',

  // 🏳️ WHITE
  white: '!bg-white !text-gray-900 dark:!bg-gray-900 dark:!text-gray-100 dark:hover:!bg-gray-800 border border-gray-300 dark:border-gray-700',
  'soft-white': '!bg-gray-50 !text-gray-800 dark:!bg-gray-800 dark:!text-gray-100 dark:hover:!bg-gray-700 border border-gray-200 dark:border-gray-600',

  // ✨ ACCENT COLORS
  'accent-teal': '!bg-teal-400 !text-teal-950 dark:!bg-teal-600 dark:!text-gray-50 dark:hover:!bg-teal-700',
  'accent-violet': '!bg-violet-400 !text-violet-950 dark:!bg-violet-600 dark:!text-gray-50 dark:hover:!bg-violet-700',

  // ✨TRANSPARENT
  'transparent': '!bg-transparent !text-zinc-500 dark:!bg-transparent dark:!text-zinc-50',
};



export type ButtonSize = '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const ButtonSizes: Record<ButtonSize, string> = {
  '': '',
  xs: '!h-5 !text-xs',
  sm: '!h-8 !text-sm',
  md: '!h-10 !text-base',
  lg: '!h-12 !text-lg',
  xl: '!h-16 !text-xl',
};

export const ButtonSizesCircle: Record<ButtonSize, string> = {
  '': '',
  xs: '!w-5 !h-5 !text-xs !p-3',
  sm: '!w-8 !h-8 !text-sm',
  md: '!w-10 !h-10 !text-base',
  lg: '!w-12 !h-12 !text-lg',
  xl: '!w-16 !h-16 !text-xl',
};
