import React, { useState, useCallback, useEffect } from 'react'
import './App.css'
import { ImageDisplay } from './components/ImageDisplay'
import { Controls } from './components/Controls'
import { Header } from './components/Header'
import { imageToEmoji } from './utils/imageToEmoji'

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState('🍊')
  const [useMultipleEmoji, setUseMultipleEmoji] = useState(true)
  const [imageUrl, setImageUrl] = useState('/eliza.png')
  const [detailLevel, setDetailLevel] = useState(50)
  const [emojiArt, setEmojiArt] = useState('')
  const [loading, setLoading] = useState(false)

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

  // Update when controls change
  useEffect(() => {
    if (imageUrl) {
      processImage(imageUrl)
    }
  }, [imageUrl, useMultipleEmoji, selectedEmoji, detailLevel, processImage])

  const handleImageUpload = (url: string) => {
    processImage(url);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8">
        <Controls 
          selectedEmoji={selectedEmoji}
          setSelectedEmoji={setSelectedEmoji}
          useMultipleEmoji={useMultipleEmoji}
          setUseMultipleEmoji={setUseMultipleEmoji}
          onImageUpload={processImage}
          detailLevel={detailLevel}
          onDetailLevelChange={setDetailLevel}
        />
        
        <ImageDisplay 
          imageUrl={imageUrl}
          selectedEmoji={selectedEmoji}
          useMultipleEmoji={useMultipleEmoji}
          emojiArt={emojiArt}
          onImageSelect={processImage}
        />
      </main>
    </div>
  )
}

export default App
