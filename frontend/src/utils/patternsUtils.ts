import { translate } from '@/utils/translationUtils'

export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: translate('general.errors.invalidEmail'),
}

export const namePattern = {
  value: /^[A-Za-z\s\u00C0-\u017F]{1,30}$/,
  message: translate('general.errors.invalidName'),
}
