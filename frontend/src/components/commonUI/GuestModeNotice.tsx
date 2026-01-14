import { useAuthContext } from '@/hooks/useAuthContext'
import { HStack, Text } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DefaultButton, RedButton } from './Button'

const GUEST_MODE_NOTIFICATION = 'guest_mode_notification'

export default function GuestModeNotice() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { logout } = useAuthContext()

  //check localstorage to persist the notice visibility state
  const [showNotice, setShowNotice] = useState(() => {
    const savedState = localStorage.getItem(GUEST_MODE_NOTIFICATION)
    return savedState ? JSON.parse(savedState) : true // Default to be true if not found
  })

  const handleLogin = () => {
    logout()
    navigate({ to: '/login' })
  }

  const handleCancel = () => {
    setShowNotice(false)
    localStorage.setItem(GUEST_MODE_NOTIFICATION, JSON.stringify(false))
  }

  if (!showNotice) return null

  return (
    <HStack
      bg="orange.50"
      borderRadius="md"
      px={3}
      py={1}
      borderColor="orange.200"
      borderWidth="1px"
      color="orange.700"
      fontSize="sm"
      fontWeight="medium"
      pointerEvents="auto"
    >
      <Text textStyle="xs" display={{ base: 'block', md: 'none' }}>
        {t('components.guestModeNotice.message')}
      </Text>
      <Text display={{ base: 'none', md: 'block' }}>
        {t('components.guestModeNotice.messageWithAction')}
      </Text>
      <DefaultButton size="xs" onClick={handleLogin}>
        {t('general.actions.login')}
      </DefaultButton>
      <RedButton size="xs" onClick={handleCancel} variant="ghost">
        {t('general.actions.cancel')}
      </RedButton>
    </HStack>
  )
}
