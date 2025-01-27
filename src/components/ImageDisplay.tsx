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
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !preRef.current) return

      const container = containerRef.current
      const pre = preRef.current

      // Reset transform and clear any previous measurements
      pre.style.transform = 'none'
      pre.style.maxWidth = 'none'
      pre.style.maxHeight = 'none'

      // Get fresh measurements
      const containerRect = container.getBoundingClientRect()
      const preRect = pre.getBoundingClientRect()

      // Calculate available space with padding
      const padding = 32
      const availableWidth = containerRect.width - padding
      const availableHeight = containerRect.height - padding

      // Calculate scale factors
      const scaleX = availableWidth / preRect.width
      const scaleY = availableHeight / preRect.height

      // Use the smaller scale to maintain aspect ratio, but don't scale up
      const newScale = Math.min(scaleX, scaleY)

      // Apply the new scale
      setScale(newScale)
    }

    // Create a debounced version of calculateScale
    let debounceTimer: number
    const debouncedCalculateScale = () => {
      window.clearTimeout(debounceTimer)
      debounceTimer = window.setTimeout(calculateScale, 100)
    }

    // Initial calculation with a slight delay to ensure content is rendered
    const initialTimer = window.setTimeout(calculateScale, 50)

    // Set up ResizeObserver for more reliable size change detection
    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(debouncedCalculateScale)
    }

    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current)
    }

    // Clean up
    return () => {
      window.clearTimeout(initialTimer)
      window.clearTimeout(debounceTimer)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
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
        className="w-full h-full max-w-[800px] max-h-[800px] flex items-center justify-center border border-black m-4 overflow-hidden"
      >
        <pre
          ref={preRef}
          className="font-mono text-xs leading-none whitespace-pre transition-transform duration-200 will-change-transform"
          style={{ 
            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", sans-serif',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            visibility: scale === 1 ? 'hidden' : 'visible', // Prevent flash of unscaled content
          }}
        >
          {emojiArt}
        </pre>
      </div>
    </div>
  )
} 