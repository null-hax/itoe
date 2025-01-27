const getPixelData = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): ImageData => {
  return ctx.getImageData(0, 0, width, height);
};

const rgbToLuminance = (r: number, g: number, b: number): number => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

const EMOJI_MAP = ['⬜', '🟨', '🟧', '🟫', '⬛']

export async function imageToEmoji(
  imageUrl: string, 
  singleEmoji?: string
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      // Calculate size to maintain aspect ratio
      const maxWidth = 50
      const scale = maxWidth / img.width
      canvas.width = maxWidth
      canvas.height = Math.floor(img.height * scale)

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      let result = ''
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4
          const brightness = (
            imageData.data[i] * 0.299 +
            imageData.data[i + 1] * 0.587 +
            imageData.data[i + 2] * 0.114
          ) / 255
          
          if (singleEmoji) {
            result += brightness < 0.5 ? singleEmoji : '⬜'
          } else {
            const emojiIndex = Math.floor(brightness * (EMOJI_MAP.length - 1))
            result += EMOJI_MAP[emojiIndex]
          }
        }
        result += '\n'
      }
      
      resolve(result)
    }
    
    img.src = imageUrl
  })
}

export const matrixToText = (matrix: string[][]): string => {
  return matrix.map(row => row.join('')).join('\n');
};