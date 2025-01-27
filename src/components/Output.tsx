import { useEffect, useState } from 'react';
import { imageToEmoji } from '../utils/imageToEmoji';

interface OutputProps {
  imageUrl: string;
  selectedEmoji?: string;
  useAllEmoji: boolean;
}

const Output = ({ imageUrl, selectedEmoji, useAllEmoji }: OutputProps) => {
  const [emojiMatrix, setEmojiMatrix] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const convertImage = async () => {
      try {
        setLoading(true);
        const matrix = await imageToEmoji(
          imageUrl,
          50,
          useAllEmoji ? undefined : selectedEmoji
        );
        setEmojiMatrix(matrix);
      } catch (error) {
        console.error('Failed to convert image:', error);
      } finally {
        setLoading(false);
      }
    };

    convertImage();
  }, [imageUrl, selectedEmoji, useAllEmoji]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-50" />
      <div className="relative bg-white rounded-xl shadow-xl p-6 border-2 border-primary/20">
        <pre
          className="font-mono text-[0.5em] sm:text-[0.6em] md:text-[0.7em] leading-[1.1] overflow-x-auto whitespace-pre"
          style={{
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            fontFamily: 'monospace'
          }}
        >
          {emojiMatrix.map((row, i) => (
            <div key={i} className="whitespace-pre">
              {row.join('')}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default Output;