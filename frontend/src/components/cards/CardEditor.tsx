import RichTextEditor from '@/components/commonUI/RichText/RichTextEditor'
import useTextCounter from '@/hooks/useTextCounter'
import { Box } from '@chakra-ui/react'
import type { Editor } from '@tiptap/react'
import { useCallback, useMemo, useState } from 'react'
import TextCounter from '../commonUI/TextCounter'

export interface CardEditorProps {
  side: 'front' | 'back'
  isFlipped: boolean
  frontEditor: Editor | null
  backEditor: Editor | null
}

export default function CardEditor({ side, isFlipped, frontEditor, backEditor }: CardEditorProps) {
  const commonBoxStyles = useMemo(
    () => ({
      position: 'absolute' as const,
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden' as const,
      borderRadius: 'lg',
      borderWidth: '1px',
      borderColor: 'bg.200',
      cursor: 'text',
    }),
    [],
  )

  const [frontTextLength, setFrontTextLength] = useState(0)
  const [backTextLength, setBackTextLength] = useState(0)

  const memoizedSetFrontTextLength = useCallback(setFrontTextLength, [])
  const memoizedSetBackTextLength = useCallback(setBackTextLength, [])
  const noopSetter = useCallback(() => {}, [])

  useTextCounter(
    side === 'front' ? frontEditor : null,
    side === 'front' ? memoizedSetFrontTextLength : noopSetter,
  )
  useTextCounter(
    side === 'back' ? backEditor : null,
    side === 'back' ? memoizedSetBackTextLength : noopSetter,
  )

  const currentTextLength = useMemo(
    () => (side === 'front' ? frontTextLength : backTextLength),
    [side, frontTextLength, backTextLength],
  )

  return (
    <Box
      position="relative"
      height="100%"
      width="100%"
      style={{ perspective: '1000px' }}
      transition="transform 0.3s ease"
      transformStyle="preserve-3d"
      transform={isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'}
    >
      <Box {...commonBoxStyles} bg="bg.50">
        {side === 'front' && frontEditor && <RichTextEditor editor={frontEditor} />}
        {side === 'front' && <TextCounter textLength={currentTextLength} />}
      </Box>

      <Box
        {...commonBoxStyles}
        bg="bg.box"
        transform="rotateY(180deg)"
        visibility={isFlipped ? 'visible' : 'hidden'}
      >
        {side === 'back' && backEditor && <RichTextEditor editor={backEditor} />}
        {side === 'back' && <TextCounter textLength={currentTextLength} />}
      </Box>
    </Box>
  )
}
