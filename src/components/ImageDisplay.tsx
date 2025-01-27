import { useEffect, useState } from 'react'
import { imageToEmoji } from '../utils/imageToEmoji'

interface ImageDisplayProps {
  imageUrl: string
  selectedEmoji: string
  useMultipleEmoji: boolean
}

export function ImageDisplay({ 
  imageUrl, 
  selectedEmoji, 
  useMultipleEmoji 
}: ImageDisplayProps) {
  const [emojiArt, setEmojiArt] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    imageToEmoji(imageUrl, useMultipleEmoji ? undefined : selectedEmoji)
      .then(setEmojiArt)
      .finally(() => setLoading(false))
  }, [imageUrl, selectedEmoji, useMultipleEmoji])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin text-4xl">🍊</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <pre
        className="font-mono text-xs leading-none whitespace-pre"
        style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", sans-serif' }}
      >
        {emojiArt}
      </pre>
    </div>
  )
} 