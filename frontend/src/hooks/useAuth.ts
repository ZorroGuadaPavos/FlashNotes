import { useAuthContext } from '@/contexts/useAuthContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ApiRequestOptions } from '@/client/core/ApiRequestOptions'
import { toaster } from '@/components/ui/toaster'
import { type ErrorResponse, handleError, mapToApiError } from '@/utils/errorsUtils'
import type { AxiosError } from 'axios'
import {
  type Body_login_login_access_token as AccessToken,
  LoginService,
  type UserPublic,
  type UserRegister,
  UsersService,
} from '../client'

const useAuth = () => {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isGuest, isLoggedIn, logout } = useAuthContext()
  const { data: user, isLoading } = useQuery<UserPublic | null, Error>({
    queryKey: ['currentUser'],
    queryFn: UsersService.readUserMe,
    enabled: isLoggedIn && !isGuest,
  })

  const signUpMutation = useMutation({
    mutationFn: (data: UserRegister) => UsersService.registerUser({ requestBody: data }),

    onSuccess: () => {
      navigate({ to: '/login' })
      toaster.create({
        title: t('hooks.auth.accountCreated'),
        description: t('hooks.auth.accountCreatedDescription'),
        type: 'success',
      })
    },
    onError: (err: Error | AxiosError | ErrorResponse) => {
      const request: ApiRequestOptions = {
        method: 'POST',
        url: '/signup',
      }
      const apiErrorDto = mapToApiError(err, request)
      const message = handleError(apiErrorDto, {
        toastTitle: t('general.errors.errorCreatingAccount'),
      })

      if (apiErrorDto.status === 409) {
        setError(t('general.errors.emailAlreadyInUse') || t('general.errors.somethingWentWrong'))
      } else {
        setError(message)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const login = async (data: AccessToken) => {
    const response = await LoginService.loginAccessToken({
      formData: data,
    })
    localStorage.setItem('access_token', response.access_token)
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: '/collections' })
    },
    onError: (err: Error | AxiosError | ErrorResponse) => {
      const request: ApiRequestOptions = {
        method: 'POST',
        url: '/login',
      }
      const apiErrorDto = mapToApiError(err, request)
      const message = handleError(apiErrorDto, {
        toastTitle: t('general.errors.loginFailed'),
        fallbackMessage: t('general.errors.somethingWentWrong'),
      })

      let finalError = message
      if (apiErrorDto.status === 401) {
        finalError = t('general.errors.invalidCredentials')
      }
      setError(finalError)
    },
  })

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    isLoading,
    error,
    resetError: () => setError(null),
  }
}

export default useAuth
