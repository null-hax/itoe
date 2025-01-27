import { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import html2canvas from 'html2canvas'
import { imageToEmoji } from '../utils/imageToEmoji'

interface ImageDisplayProps {
  imageUrl: string
  selectedEmoji: string
  useMultipleEmoji: boolean
  onImageSelect: (imageUrl: string) => Promise<void>
  emojiArt: string
  loading: boolean
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageUrl,
  selectedEmoji,
  useMultipleEmoji,
  onImageSelect,
  emojiArt,
  loading
}) => {
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const imageUrl = URL.createObjectURL(file)
        await onImageSelect(imageUrl)
      }
    },
    multiple: false,
    noKeyboard: true,
    preventDropOnDocument: true
  })

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !preRef.current || !emojiArt) return

      const container = containerRef.current
      const pre = preRef.current

      pre.style.transform = 'none'
      pre.style.maxWidth = 'none'
      pre.style.maxHeight = 'none'
      pre.style.visibility = 'hidden'

      requestAnimationFrame(() => {
        if (!containerRef.current || !preRef.current) return
        
        const containerRect = container.getBoundingClientRect()
        const preRect = pre.getBoundingClientRect()

        const padding = 32
        const availableWidth = containerRect.width - padding
        const availableHeight = containerRect.height - padding

        const scaleX = availableWidth / preRect.width
        const scaleY = availableHeight / preRect.height

        const newScale = Math.min(scaleX, scaleY)
        
        setScale(newScale)
        pre.style.visibility = 'visible'
      })
    }

    calculateScale()

    if (!resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        requestAnimationFrame(calculateScale)
      })
    }

    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current)
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [emojiArt])

  const handleExport = async () => {
    if (!preRef.current) return
    
    const canvas = await html2canvas(preRef.current, {
      backgroundColor: '#D7D5CA',
      scale: window.devicePixelRatio * 5,
    })
    
    const link = document.createElement('a')
    link.download = 'emoji-art.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopy = async () => {
    if (!emojiArt) return
    
    try {
      await navigator.clipboard.writeText(emojiArt)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin text-4xl"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div 
        {...getRootProps()}
        ref={containerRef}
        className={`w-full h-full max-w-[800px] max-h-[800px] flex items-center justify-center border border-black m-4 overflow-hidden relative ${
          isDragActive ? 'bg-gray-100' : ''
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="absolute inset-0 bg-opacity-10 flex items-center justify-center">
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
                 
            </div>
          </div>
        )}
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
      
      {emojiArt && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 text-black border-2 border-black cursor-pointer hover:bg-white/20 transition-colors hover:border-black/80"
          >
            Export
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-black border-2 border-black cursor-pointer hover:bg-white/20 transition-colors hover:border-black/80"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  )
} 