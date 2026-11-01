
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

interface ProfilePhotoSelectorProps {
  image: File | string | null;
  setImage: (image: File | null) => void;
}

const ProfilePhotoSelector = ({
  image,
  setImage,
}: ProfilePhotoSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Release temporary preview URLs when they are replaced or removed.
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setImage(file);

      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  const imageSrc =
    previewUrl || (typeof image === 'string' ? image : null);

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!imageSrc ? (
        <div className="w-20 h-20 flex items-center justify-center bg-yellow-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-yellow-500" />

          <button
            type="button"
            aria-label="Upload profile photo"
            className="w-8 h-8 flex items-center justify-center bg-yellow-600 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={imageSrc}
            alt="Profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />

          <button
            type="button"
            aria-label="Remove profile photo"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
