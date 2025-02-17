import { useState, useCallback, useEffect } from 'react'
import { ImageDisplay } from './components/ImageDisplay'
import { Controls } from './components/Controls'
import { Header } from './components/Header'
import { imageToEmoji } from './utils/imageToEmoji'
import { generateFavicon } from './utils/generateFavicon'

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState('🍊')
  const [useMultipleEmoji, setUseMultipleEmoji] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [detailLevel, setDetailLevel] = useState(55)
  const [emojiArt, setEmojiArt] = useState('')
  const [loading, setLoading] = useState(true)

  const processImage = useCallback(async (url: string) => {
    try {
      setLoading(true)
      const result = await imageToEmoji(
        url,
        useMultipleEmoji ? undefined : selectedEmoji,
        detailLevel
      )
      setEmojiArt(result)
      setImageUrl(url)
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setLoading(false)
    }
  }, [useMultipleEmoji, selectedEmoji, detailLevel])

  // Initial load and control changes
  useEffect(() => {
    if (!imageUrl) {
      // Load default image on first mount
      processImage('/eliza.png')
    } else {
      // Process current image when controls change
      processImage(imageUrl)
    }
  }, [imageUrl, processImage])

  // Set favicon on mount
  useEffect(() => {
    const favicon = document.createElement('link')
    favicon.rel = 'icon'
    favicon.type = 'image/png'
    favicon.href = generateFavicon('🍊')
    
    // Remove any existing favicons
    document.head
      .querySelectorAll('link[rel*="icon"]')
      .forEach(el => el.remove())
    
    // Add our new favicon
    document.head.appendChild(favicon)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#D7D5CA]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-4 overflow-hidden flex flex-col min-h-0">
        <Controls 
          selectedEmoji={selectedEmoji}
          setSelectedEmoji={setSelectedEmoji}
          useMultipleEmoji={useMultipleEmoji}
          setUseMultipleEmoji={setUseMultipleEmoji}
          onImageUpload={processImage}
          detailLevel={detailLevel}
          onDetailLevelChange={setDetailLevel}
        />
        
        <div className="flex-1 min-h-0">
          <ImageDisplay 
            emojiArt={emojiArt}
            onImageSelect={processImage}
            loading={loading}
          />
        </div>
      </main>
    </div>
  )
}

export default App
