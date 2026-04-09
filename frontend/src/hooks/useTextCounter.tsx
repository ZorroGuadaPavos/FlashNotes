import { toaster } from '@/components/ui/toaster'
import { MAX_CHARACTERS } from '@/utils/text'
import type { Editor } from '@tiptap/react'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

function useTextCounter(editor: Editor | null, setTextLength: (length: number) => void) {
  const { t } = useTranslation()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasShownToastRef = useRef(false)

  const handleTextChange = useCallback(
    (currentEditor: Editor) => {
      const currentText = currentEditor.getText()
      const textLength = currentText.length

      if (textLength > MAX_CHARACTERS) {
        const truncatedText = currentText.substring(0, MAX_CHARACTERS)
        currentEditor.chain().focus().setContent(truncatedText).run()
        if (!hasShownToastRef.current) {
          hasShownToastRef.current = true
          toaster.create({
            title: t('components.editorTextCounter.title'),
            description: t('components.editorTextCounter.description'),
            type: 'info',
          })

          timeoutRef.current = setTimeout(() => {
            hasShownToastRef.current = false
          }, 3000)
        }

        setTextLength(MAX_CHARACTERS)
      } else {
        hasShownToastRef.current = false
        setTextLength(textLength)
      }
    },
    [setTextLength, t],
  )

  useEffect(() => {
    if (!editor) {
      setTextLength(0)
      return
    }

    const handleUpdate = ({ editor: currentEditor }: { editor: Editor }) => {
      if (currentEditor && !currentEditor.isDestroyed) {
        handleTextChange(currentEditor)
      }
    }

    editor.on('update', handleUpdate)

    handleTextChange(editor)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (editor && !editor.isDestroyed) {
        editor.off('update', handleUpdate)
      }
    }
  }, [editor, handleTextChange, setTextLength])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
}

export default useTextCounter
