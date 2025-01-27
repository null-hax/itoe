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

// Define an expanded color map with more shades and patterns
const COLOR_EMOJI_MAP = [
  // Whites and Bright Shades (ordered by brightness)
  { color: [255, 255, 255], emoji: ' ' },     // Pure White (space)
  { color: [252, 252, 252], emoji: '️⚪' },    // Almost White
  { color: [248, 248, 248], emoji: '🤍' },    // Soft White
  { color: [245, 245, 245], emoji: '💭' },    // Cloud White
  { color: [240, 240, 240], emoji: '🕊️' },    // Dove White
  
  // Light Grays (fine-tuned gradients)
  { color: [230, 230, 230], emoji: '🌕' },    // Full Moon
  { color: [220, 220, 220], emoji: '🌖' },    // Waning Gibbous
  { color: [210, 210, 210], emoji: '🌗' },    // Last Quarter
  { color: [200, 200, 200], emoji: '🌘' },    // Waning Crescent
  { color: [190, 190, 190], emoji: '🌑' },    // New Moon
  
  // Mid Grays
  { color: [180, 180, 180], emoji: '☁️' },    // Light Cloud
  { color: [170, 170, 170], emoji: '🌫️' },    // Fog
  { color: [160, 160, 160], emoji: '🌚' },    // Medium Gray
  { color: [150, 150, 150], emoji: '💨' },    // Dash
  { color: [140, 140, 140], emoji: '🌪️' },    // Dark Cloud
  
  // Dark Grays and Blacks
  { color: [100, 100, 100], emoji: '🖤' },    // Very Dark Gray
  { color: [50, 50, 50], emoji: '⬛️' },      // Almost Black
  { color: [0, 0, 0], emoji: '⚫️' },         // Pure Black
  
  // Reds (expanded range)
  { color: [255, 0, 0], emoji: '🟥' },      // Pure Red
  { color: [255, 20, 20], emoji: '🛑' },     // Bright Red
  { color: [220, 20, 60], emoji: '🍎' },     // Crimson
  { color: [200, 0, 0], emoji: '🔴' },      // Deep Red
  { color: [178, 34, 34], emoji: '🍅' },     // Fire Brick
  { color: [139, 0, 0], emoji: '🌹' },      // Dark Red
  { color: [120, 0, 0], emoji: '🍓' },      // Very Dark Red
  
  // Pinks
  { color: [255, 192, 203], emoji: '🎀' },   // Light Pink
  { color: [255, 182, 193], emoji: '🌸' },   // Cherry Blossom
  { color: [255, 105, 180], emoji: '💖' },   // Hot Pink
  { color: [255, 20, 147], emoji: '💓' },    // Deep Pink
  { color: [219, 112, 147], emoji: '🌺' },   // Pale Violet Red
  
  // Oranges
  { color: [255, 165, 0], emoji: '🟧' },     // Pure Orange
  { color: [255, 140, 0], emoji: '🟠' },     // Dark Orange
  { color: [255, 127, 80], emoji: '🔸' },    // Coral
  { color: [255, 99, 71], emoji: '🍑' },     // Tomato
  { color: [255, 69, 0], emoji: '🍊' },      // Red-Orange
  
  // Yellows
  { color: [255, 255, 0], emoji: '🟨' },     // Pure Yellow
  { color: [255, 215, 0], emoji: '⭐' },     // Gold
  { color: [255, 223, 0], emoji: '🌟' },     // Bright Yellow
  { color: [240, 230, 140], emoji: '🌼' },   // Khaki
  { color: [238, 232, 170], emoji: '🌻' },   // Pale Goldenrod
  
  // Browns
  { color: [165, 42, 42], emoji: '🟫' },     // Brown
  { color: [139, 69, 19], emoji: '🌰' },     // Saddle Brown
  { color: [160, 82, 45], emoji: '📦' },     // Sienna
  { color: [210, 180, 140], emoji: '📔' },   // Tan
  { color: [222, 184, 135], emoji: '🥜' },   // Burlywood
  
  // Greens
  { color: [0, 255, 0], emoji: '💚' },      // Pure Green
  { color: [50, 205, 50], emoji: '🌿' },     // Lime Green
  { color: [34, 139, 34], emoji: '🌲' },     // Forest Green
  { color: [0, 128, 0], emoji: '🌳' },      // Green
  { color: [144, 238, 144], emoji: '🍀' },   // Light Green
  { color: [152, 251, 152], emoji: '🥬' },   // Pale Green
  { color: [46, 139, 87], emoji: '🌱' },     // Sea Green
  
  // Blues
  { color: [0, 0, 255], emoji: '💙' },      // Pure Blue
  { color: [0, 0, 205], emoji: '🌊' },      // Medium Blue
  { color: [25, 25, 112], emoji: '🌌' },     // Midnight Blue
  { color: [0, 191, 255], emoji: '💦' },     // Deep Sky Blue
  { color: [135, 206, 235], emoji: '🩵' },   // Sky Blue
  { color: [173, 216, 230], emoji: '�' },   // Light Blue
  
  // Purples
  { color: [128, 0, 128], emoji: '💜' },     // Purple
  { color: [147, 112, 219], emoji: '🔮' },   // Medium Purple
  { color: [153, 50, 204], emoji: '☂️' },    // Dark Orchid
  { color: [186, 85, 211], emoji: '🎆' },    // Medium Orchid
  { color: [221, 160, 221], emoji: '🌂' },   // Plum
  { color: [238, 130, 238], emoji: '💟' },   // Violet
  
  // Teals and Cyans
  { color: [0, 128, 128], emoji: '💎' },     // Teal
  { color: [0, 255, 255], emoji: '💠' },     // Cyan
  { color: [224, 255, 255], emoji: '🌐' },   // Light Cyan
  { color: [127, 255, 212], emoji: '🧊' },   // Aquamarine
  
  // Special Effects and Highlights
  { color: [255, 248, 220], emoji: '✨' },   // Bright Highlights
  { color: [245, 245, 220], emoji: '⭐' },   // Beige Highlights
  { color: [255, 250, 240], emoji: '🌟' },   // Floral White
  { color: [240, 248, 255], emoji: '❄️' },   // Alice Blue
  { color: [245, 255, 250], emoji: '💫' }    // Mint Cream
];

// Enhance color distance calculation with HSL components
const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
};

const getColorDistance = (
  r1: number, 
  g1: number, 
  b1: number, 
  r2: number, 
  g2: number, 
  b2: number
): number => {
  // Convert to HSL for better color comparison
  const [h1, s1, l1] = rgbToHsl(r1, g1, b1);
  const [h2, s2, l2] = rgbToHsl(r2, g2, b2);

  // Calculate weighted distances in HSL space
  const dh = Math.min(Math.abs(h2 - h1), 360 - Math.abs(h2 - h1)) * 2;
  const ds = (s2 - s1) * 1.5;
  const dl = (l2 - l1) * 3;

  // Also consider RGB distance for accuracy
  const rMean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  const weightR = 2 + rMean / 256;
  const weightG = 4.0;
  const weightB = 2 + (255 - rMean) / 256;
  
  // Combine both HSL and RGB distances
  const rgbDistance = Math.sqrt(weightR * dr * dr + weightG * dg * dg + weightB * db * db);
  const hslDistance = Math.sqrt(dh * dh + ds * ds + dl * dl);
  
  return rgbDistance * 0.5 + hslDistance * 0.5;
};

// Find the closest matching emoji based on color
const findClosestEmoji = (r: number, g: number, b: number): string => {
  let minDistance = Infinity;
  let closestEmoji = '⬜';

  for (const entry of COLOR_EMOJI_MAP) {
    const distance = getColorDistance(
      r, g, b,
      entry.color[0], entry.color[1], entry.color[2]
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestEmoji = entry.emoji;
    }
  }

  return closestEmoji;
};

export async function imageToEmoji(
  imageUrl: string, 
  singleEmoji?: string,
  detailLevel: number = 50  // Default detail level of 50
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      // Use detailLevel to control output size
      const scale = detailLevel / img.width
      canvas.width = detailLevel
      canvas.height = Math.floor(img.height * scale)

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      let result = ''
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4
          const r = imageData.data[i]
          const g = imageData.data[i + 1]
          const b = imageData.data[i + 2]
          
          if (singleEmoji) {
            const brightness = rgbToLuminance(r, g, b) / 255
            result += brightness < 0.5 ? singleEmoji : '⬜'
          } else {
            result += findClosestEmoji(r, g, b)
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

