import type { ApiError } from '@/client'
import { translate } from '@/utils/translationUtils'

export const handleError = (
  err: ApiError,
  showToast: (title: string, message: string, type: string) => void,
) => {
  const errDetail = (err.body as { detail?: string | { msg: string }[] })?.detail
  let errorMessage = translate('general.errors.default')

  if (typeof errDetail === 'string') {
    errorMessage = errDetail
  } else if (Array.isArray(errDetail) && errDetail.length > 0) {
    errorMessage = errDetail[0].msg
  }
  showToast(translate('general.errors.error'), errorMessage, 'error')
}
