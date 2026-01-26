import React, { useRef, useState } from 'react';

type Props = {
  value?: string;
  onChange: (dataUrl: string) => void;
};

const ImageUploader: React.FC<Props> = ({ value, onChange }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" style={{display: 'none'}} onChange={(e)=>handleFile(e.target.files?.[0])} />
      <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        <button onClick={() => fileRef.current?.click()}>Upload image</button>
        {preview && <img src={preview} alt="preview" style={{height: 64, objectFit: 'cover'}} />}
      </div>
    </div>
  );
};

export default ImageUploader;
