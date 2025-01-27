import { useState } from 'react'
import './App.css'
import { ImageDisplay } from './components/ImageDisplay'
import { Controls } from './components/Controls'
import { Header } from './components/Header'

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState('🍊')
  const [useMultipleEmoji, setUseMultipleEmoji] = useState(true)
  const [imageUrl, setImageUrl] = useState('/eliza.png')

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col gap-8">
        <Controls 
          selectedEmoji={selectedEmoji}
          setSelectedEmoji={setSelectedEmoji}
          useMultipleEmoji={useMultipleEmoji}
          setUseMultipleEmoji={setUseMultipleEmoji}
          onImageUpload={setImageUrl}
        />
        
        <ImageDisplay 
          imageUrl={imageUrl}
          selectedEmoji={selectedEmoji}
          useMultipleEmoji={useMultipleEmoji}
        />
      </main>
    </div>
  )
}

export default App
