import { useState } from 'react'
import { imageToEmoji } from '../utils/imageToEmoji'

interface ImageDisplayProps {
  imageUrl: string
  selectedEmoji: string
  useMultipleEmoji: boolean
  onImageSelect: (imageUrl: string) => Promise<void>
  emojiArt: string
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  selectedEmoji,
  useMultipleEmoji,
  onImageSelect,
  emojiArt
}) => {
  const [loading, setLoading] = useState(false)

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