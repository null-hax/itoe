import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import React from 'react'

interface ControlsProps {
  selectedEmoji: string
  setSelectedEmoji: (emoji: string) => void
  useMultipleEmoji: boolean
  setUseMultipleEmoji: (use: boolean) => void
  onImageUpload: (url: string) => void
  onSingleEmojiChange: (emoji: string) => void
  onDetailLevelChange: (detail: number) => void
  detailLevel: number
  singleEmoji: string
}

export const Controls: React.FC<ControlsProps> = ({
  selectedEmoji,
  setSelectedEmoji,
  useMultipleEmoji,
  setUseMultipleEmoji,
  onImageUpload,
  onSingleEmojiChange,
  onDetailLevelChange,
  detailLevel,
  singleEmoji
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onImageUpload(url)
    }
  }

  return (
    <div className="flex flex-wrap gap-6 items-center justify-center">
      <button
        onClick={() => setUseMultipleEmoji(!useMultipleEmoji)}
        className={`px-4 py-2 transition-colors cursor-pointer
          ${useMultipleEmoji 
            ? 'text-black border-b-2 bg-none border-black hover:bg-white/20 transition-colors hover:border-black/80' 
            : 'text-black border-b-2 bg-none border-black hover:bg-white/20 transition-colors hover:border-black/80'
          }`}
      >
        {useMultipleEmoji ? 'Using All Emoji' : 'Using Single Emoji'}
      </button>

      {!useMultipleEmoji && (
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-4xl hover:opacity-80 transition-opacity"
            aria-label="Select emoji"
          >
            {selectedEmoji}
          </button>
          
          {showEmojiPicker && (
            <div className="absolute z-10 top-full mt-2">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setSelectedEmoji(emojiData.emoji)
                  setShowEmojiPicker(false)
                }}
              />
            </div>
          )}
        </div>
      )}

      <label className="px-4 py-2 text-black border-2 border-black cursor-pointer hover:bg-white/20 transition-colors hover:border-black/80">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
      
      <div className="flex items-center gap-4">
        <label className="text-black min-w-[50px]">Detail</label>
        <input
          type="range"
          min="20"
          max="90"
          value={detailLevel}
          onChange={(e) => onDetailLevelChange(Number(e.target.value))}
          className="detail-slider"
        />
      </div>
    </div>
  )
}