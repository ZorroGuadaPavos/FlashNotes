import { translate } from '@/utils/translationUtils'

export const passwordRules = (isRequired = true) => {
  const rules: {
    minLength: { value: number; message: string }
    required?: string
  } = {
    minLength: {
      value: 8,
      message: translate('general.errors.passwordMinCharacters'),
    },
  }

  if (isRequired) {
    rules.required = translate('general.errors.passwordIsRequired')
  }

  return rules
}

export const confirmPasswordRules = (getValues: () => unknown, isRequired = true) => {
  const rules: {
    validate: (value: string) => boolean | string
    required?: string
  } = {
    validate: (value: string) => {
      const formValues = getValues() as {
        password?: string
        new_password?: string
      }
      const password = formValues.password || formValues.new_password
      return value === password ? true : translate('general.errors.passwordsDoNotMatch')
    },
  }

  if (isRequired) {
    rules.required = translate('general.errors.passwordConfirmationIsRequired')
  }

  return rules
}
