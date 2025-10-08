
import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon, MagicWandIcon } from './icons';
import type { BackgroundChoice } from '../App';

type Tone = 'Professional' | 'News' | 'Entertainment' | 'Casual' | 'Witty';
type ImageStyle = 'Photorealistic' | 'Abstract' | 'Minimalist' | 'Cinematic' | 'Fantasy' | 'Sci-Fi' | 'Vintage' | 'Watercolor' | 'Cyberpunk';

interface InputFormProps {
  onGenerate: (
    content: string, 
    logo: File, 
    tone: Tone, 
    audience: string,
    background: BackgroundChoice,
    imageStyle: ImageStyle
  ) => void;
}

const libraryImages = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554494583-499315d81d23?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505682499293-233fb141754c?q=80&w=1200&auto=format&fit=crop',
];

export const InputForm: React.FC<InputFormProps> = ({ onGenerate }) => {
  const [content, setContent] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>('News');
  const [audience, setAudience] = useState('');
  const [error, setError] = useState('');
  
  const [backgroundSource, setBackgroundSource] = useState<'ai' | 'upload' | 'library'>('ai');
  const [backgroundImageFiles, setBackgroundImageFiles] = useState<File[]>([]);
  const [backgroundImagePreviews, setBackgroundImagePreviews] = useState<string[]>([]);
  const [selectedUploadIndex, setSelectedUploadIndex] = useState<number | null>(null);
  const [selectedLibraryImage, setSelectedLibraryImage] = useState<string | null>(null);
  const [imageStyle, setImageStyle] = useState<ImageStyle>('Photorealistic');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs to prevent memory leaks
    return () => {
      backgroundImagePreviews.forEach(url => URL.revokeObjectURL(url));
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [backgroundImagePreviews, logoPreview]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (type === 'logo') {
        // Fix: Use files.item(0) to get a properly typed `File | null` object.
        const file = files.item(0);
        // Fix: Add a null check for file and then access its properties to prevent type errors.
        if (file && file.type.startsWith('image/')) {
            setLogo(file);
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(URL.createObjectURL(file));
            setError('');
        } else {
            setError('Please upload a valid image file for the logo (PNG, JPG, etc.).');
            setLogo(null);
            setLogoPreview(null);
        }
    } else { // background
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            const newFiles = [...backgroundImageFiles, ...imageFiles];
            setBackgroundImageFiles(newFiles);

            const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
            setBackgroundImagePreviews(prev => [...prev, ...newPreviews]);
            
            if (selectedUploadIndex === null) {
                setSelectedUploadIndex(0);
            }
            setBackgroundSource('upload');
            setError('');
        }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLElement>, type: 'logo' | 'background') => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      if (type === 'logo') {
        // Fix: Use files.item(0) to get a properly typed `File | null` object.
        const file = files.item(0);
        // Fix: Add a null check for file and then access its properties to prevent type errors.
        if (file && file.type.startsWith('image/')) {
            setLogo(file);
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(URL.createObjectURL(file));
            setError('');
        } else {
            setError('Please upload a valid image file for the logo (PNG, JPG, etc.).');
            setLogo(null);
            setLogoPreview(null);
        }
      } else { // background
        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            const newFiles = [...backgroundImageFiles, ...imageFiles];
            setBackgroundImageFiles(newFiles);

            const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
            setBackgroundImagePreviews(prev => [...prev, ...newPreviews]);
            
            if (selectedUploadIndex === null) {
                setSelectedUploadIndex(0);
            }
            setBackgroundSource('upload');
            setError('');
        }
      }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) {
      setError('Please provide some content for the post.');
      return;
    }
    if (!logo) {
      setError('Please upload a brand logo.');
      return;
    }
    
    let background: BackgroundChoice;
    if (backgroundSource === 'ai') {
        background = { type: 'ai' };
    } else if (backgroundSource === 'upload') {
        if (selectedUploadIndex === null || !backgroundImageFiles[selectedUploadIndex]) {
            setError('Please upload and select a background image.');
            return;
        }
        background = { type: 'upload', file: backgroundImageFiles[selectedUploadIndex] };
    } else { // library
        if (!selectedLibraryImage) {
            setError('Please select an image from the library.');
            return;
        }
        background = { type: 'library', url: selectedLibraryImage };
    }

    setError('');
    onGenerate(content, logo, tone, audience, background, imageStyle);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
            1. Paste Your News Content
          </label>
          <textarea
            id="content"
            rows={8}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Enter the news article, press release, or any text here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
            <h3 className="block text-sm font-medium text-gray-300 mb-2">
                2. Define Tone &amp; Audience
            </h3>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 space-y-4">
                <div>
                    <span className="text-xs font-medium text-gray-400">Tone</span>
                    <div className="flex mt-1" role="group">
                        {(['Professional', 'News', 'Entertainment', 'Casual', 'Witty'] as const).map((t, index, arr) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setTone(t)}
                                className={`px-4 py-2 text-sm w-full font-medium transition-colors focus:z-10 focus:ring-2 focus:ring-indigo-500
                                ${tone === t ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'}
                                ${index === 0 ? 'rounded-l-lg' : ''}
                                ${index === arr.length - 1 ? 'rounded-r-lg' : ''}
                                border
                                `}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label htmlFor="audience" className="text-xs font-medium text-gray-400">Target Audience (Optional)</label>
                    <input
                        id="audience"
                        type="text"
                        className="w-full mt-1 bg-gray-700 border border-gray-500 rounded-lg p-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        placeholder="e.g., Tech enthusiasts, general public, investors"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                    />
                </div>
            </div>
        </div>
        
        <div>
            <h3 className="block text-sm font-medium text-gray-300 mb-2">
                3. Choose a Background
            </h3>
            <div 
                className="bg-gray-900 p-4 rounded-lg border border-gray-600 space-y-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'background')}
            >
                <div className="flex" role="group">
                    {(['ai', 'upload', 'library'] as const).map((source, index, arr) => (
                        <button
                            key={source}
                            type="button"
                            onClick={() => setBackgroundSource(source)}
                            className={`px-4 py-2 text-sm w-full font-medium transition-colors focus:z-10 focus:ring-2 focus:ring-indigo-500 capitalize
                            ${backgroundSource === source ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'}
                            ${index === 0 ? 'rounded-l-lg' : ''}
                            ${index === arr.length - 1 ? 'rounded-r-lg' : ''}
                            border
                            `}
                        >
                            {source === 'ai' ? 'AI Generated' : source === 'library' ? 'From Library' : 'Upload Image'}
                        </button>
                    ))}
                </div>
                {backgroundSource === 'upload' && (
                    <div>
                        {backgroundImagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                                {backgroundImagePreviews.map((url, index) => (
                                    <img 
                                        key={index} 
                                        src={url} 
                                        className={`w-full h-20 object-cover rounded-md cursor-pointer transition-all duration-200 ${selectedUploadIndex === index ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-indigo-500' : 'hover:opacity-75'}`}
                                        onClick={() => setSelectedUploadIndex(index)}
                                        alt={`Uploaded background ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                        <label 
                            htmlFor="bg-upload" 
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
                        >
                            <div className="space-y-1 text-center">
                                <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                                <div className="flex text-sm text-gray-400">
                                    <p className="pl-1">{backgroundImageFiles.length > 0 ? 'Add more files or change selection' : 'Upload file(s) or drag and drop'}</p>
                                </div>
                                <p className="text-xs text-gray-500">You can select multiple images</p>
                            </div>
                            <input id="bg-upload" name="bg-upload" type="file" className="sr-only" accept="image/*" multiple onChange={(e) => handleFileChange(e, 'background')} ref={bgInputRef} />
                        </label>
                    </div>
                )}
                {backgroundSource === 'library' && (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {libraryImages.map(url => (
                            <img 
                                key={url} 
                                src={url} 
                                className={`w-full h-20 object-cover rounded-md cursor-pointer transition-all duration-200 ${selectedLibraryImage === url ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-indigo-500' : 'hover:opacity-75'}`}
                                onClick={() => setSelectedLibraryImage(url)}
                                alt="Library background option"
                            />
                        ))}
                    </div>
                )}
                {backgroundSource === 'ai' && (
                    <div className="bg-gray-800/50 p-4 rounded-lg mt-4 space-y-4 border border-gray-700">
                        <h4 className="text-sm font-medium text-gray-300">AI Generation Options</h4>
                        <div>
                            <span className="text-xs font-medium text-gray-400">Image Style</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                            {(['Photorealistic', 'Abstract', 'Minimalist', 'Cinematic', 'Fantasy', 'Sci-Fi', 'Vintage', 'Watercolor', 'Cyberpunk'] as const).map((style) => (
                                <button
                                key={style}
                                type="button"
                                onClick={() => setImageStyle(style)}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 rounded-lg
                                    ${imageStyle === style ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                                `}
                                >
                                {style}
                                </button>
                            ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                4. Upload Your Brand Logo
            </label>
            <label 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'logo')}
                htmlFor="logo-upload" 
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
            >
                <div className="space-y-1 text-center">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="mx-auto h-24 w-auto object-contain" />
                    ) : (
                        <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
                    )}
                    <div className="flex text-sm text-gray-400">
                        <p className="pl-1">{logo ? 'Change logo' : 'Upload a file or drag and drop'}</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, etc.</p>
                </div>
                <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} ref={logoInputRef} />
            </label>
        </div>
        
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
          >
            <MagicWandIcon className="w-5 h-5" />
            Generate Post
          </button>
        </div>
      </form>
    </div>
  );
};