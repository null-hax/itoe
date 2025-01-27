import { useState, useRef, useEffect } from 'react'
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
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !preRef.current) return

      const container = containerRef.current
      const pre = preRef.current

      // Reset transform to measure true size
      pre.style.transform = 'none'
      
      const containerRect = container.getBoundingClientRect()
      const preRect = pre.getBoundingClientRect()

      // Add padding and calculate available space
      const padding = 48 // 24px padding on each side
      const availableWidth = containerRect.width - padding
      const availableHeight = containerRect.height - padding

      // Calculate scales
      const scaleX = availableWidth / preRect.width
      const scaleY = availableHeight / preRect.height

      // Use the smaller scale to maintain aspect ratio
      const newScale = Math.min(scaleX, scaleY)
      
      // Apply the scale
      setScale(newScale)
    }

    // Initial calculation after content renders
    const timer = setTimeout(calculateScale, 50)
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateScale)
    return () => {
      window.removeEventListener('resize', calculateScale)
      clearTimeout(timer)
    }
  }, [emojiArt])

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin text-4xl">🍊</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        ref={containerRef}
        className="w-full h-full max-w-[800px] max-h-[800px] flex items-center justify-center bg-white/50 rounded-xl shadow-sm p-6 m-4 overflow-hidden"
      >
        <pre
          ref={preRef}
          className="font-mono text-xs leading-none whitespace-pre transition-transform duration-200 will-change-transform"
          style={{ 
            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", sans-serif',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {emojiArt}
        </pre>
      </div>
    </div>
  )
} 