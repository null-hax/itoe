import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  defaultImage: string;
}

const ImageUploader = ({ onImageSelect, defaultImage }: ImageUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed
        transition-all duration-200 overflow-hidden
        ${isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }
      `}
    >
      <input {...getInputProps()} />
      
      <div className="aspect-video w-full max-w-2xl mx-auto relative">
        <img
          src={defaultImage}
          alt="Preview"
          className="w-full h-full object-contain"
        />
        
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="text-center text-white p-4">
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop image here' : 'Click or drag image here'}
            </p>
            <p className="text-sm opacity-75">
              Supports PNG, JPG, GIF, WEBP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;