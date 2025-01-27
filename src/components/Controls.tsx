import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'

interface ControlsProps {
  selectedEmoji: string
  setSelectedEmoji: (emoji: string) => void
  useMultipleEmoji: boolean
  setUseMultipleEmoji: (use: boolean) => void
  onImageUpload: (url: string) => void
}

export function Controls({
  selectedEmoji,
  setSelectedEmoji,
  useMultipleEmoji,
  setUseMultipleEmoji,
  onImageUpload,
}: ControlsProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onImageUpload(url)
    }
  }

  return (
    <div className="flex flex-wrap gap-4 items-center justify-center bg-[#D7D5CA]/20 p-6 rounded-lg shadow-sm">
      <button
        onClick={() => setUseMultipleEmoji(!useMultipleEmoji)}
        className={`px-4 py-2 rounded-lg font-medium transition-colors
          ${useMultipleEmoji 
            ? 'bg-[#FF5800] text-white' 
            : 'bg-white border-2 border-[#FF5800] text-[#FF5800]'
          }`}
      >
        {useMultipleEmoji ? 'Using All Emoji' : 'Using Single Emoji'}
      </button>

      {!useMultipleEmoji && (
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-4xl hover:scale-110 transition-transform"
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

      <label className="px-4 py-2 bg-[#0022FD] text-white rounded-lg cursor-pointer hover:bg-[#0022FD]/90 transition-colors">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  )
}