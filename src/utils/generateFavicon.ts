export const generateFavicon = (emoji: string) => {
  // Create a canvas to draw the emoji
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  
  const ctx = canvas.getContext('2d')!
  ctx.font = '28px Apple Color Emoji, Segoe UI Emoji, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // Draw the emoji in the center of the canvas
  ctx.clearRect(0, 0, 32, 32)
  ctx.fillText(emoji, 16, 16)
  
  return canvas.toDataURL('image/png')
} 