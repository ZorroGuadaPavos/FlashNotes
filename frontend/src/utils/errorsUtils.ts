import { ApiError } from '@/client'
import type { ApiRequestOptions } from '@/client/core/ApiRequestOptions'
import type { ApiResult } from '@/client/core/ApiResult'
import { toaster } from '@/components/ui/toaster'
import { translate } from '@/utils/translationUtils'
import type { AxiosError } from 'axios'

type ToastType = 'error' | 'success' | 'info' | 'warning'

export const handleError = (
  err: ApiError,
  options?: {
    toastTitle?: string
    toastType?: ToastType
    fallbackMessage?: string
    silent?: boolean
  },
): string => {
  const errDetail = (err.body as { detail?: string | { msg: string }[] })?.detail
  let errorMessage = options?.fallbackMessage || translate('general.errors.default')

  if (typeof errDetail === 'string') {
    errorMessage = errDetail
  } else if (Array.isArray(errDetail) && errDetail.length > 0) {
    errorMessage = errDetail[0].msg
  }

  if (!options?.silent) {
    toaster.create({
      title: options?.toastTitle || translate('general.errors.error'),
      description: errorMessage,
      type: options?.toastType || 'error',
    })
  }

  return errorMessage
}

export interface ErrorResponse {
  body: {
    detail?: string
  }
  status?: number
}

export function mapToApiError(
  err: Error | AxiosError | ErrorResponse,
  request: ApiRequestOptions,
): ApiError {
  let url = ''
  let status = 0
  let statusText = ''
  let body: unknown = {}
  let message = 'Unexpected error'

  switch (true) {
    case 'isAxiosError' in err && (err as AxiosError).isAxiosError: {
      const axiosErr = err as AxiosError
      url = axiosErr.config?.url ?? ''
      status = axiosErr.response?.status ?? 404
      statusText = axiosErr.response?.statusText ?? ''
      body = axiosErr.response?.data ?? {}
      message = axiosErr.message
      break
    }
    case 'body' in err: {
      const errorResponse = err as ErrorResponse
      url = request.url
      status = errorResponse.status ?? 404
      statusText = ''
      body = errorResponse.body
      message = errorResponse.body?.detail ?? 'Unknown error'
      break
    }
    default: {
      url = request.url
      status = 404
      statusText = ''
      body = {}
      message = err.message
      break
    }
  }

  const response: ApiResult = {
    url,
    status,
    statusText,
    body,
    ok: status === 200,
  }

  return new ApiError(request, response, message)
}
