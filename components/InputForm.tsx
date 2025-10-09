import React, { useState, useRef, useEffect } from 'react';
import { UploadIcon, MagicWandIcon, LinkIcon, TrashIcon, XIcon, SparklesIcon, ClassicLayoutIcon, TopBarLayoutIcon, HeavyBottomLayoutIcon, SplitVerticalLayoutIcon, MinimalLayoutIcon, FramedLayoutIcon, QuoteFocusLayoutIcon, NewsBannerLayoutIcon } from './icons';
import type { BackgroundChoice, BrandKit, SocialHandle, SocialPlatform, GeneratedTextContent, AppStep, DesignTemplate, FontStyle } from '../types';
import { getContentFromURL } from '../services/geminiService';


type Tone = 'Professional' | 'News' | 'Entertainment' | 'Casual' | 'Witty';
type ImageStyle = 'Photorealistic' | 'Abstract' | 'Minimalist' | 'Cinematic' | 'Fantasy' | 'Sci-Fi' | 'Vintage' | 'Watercolor' | 'Cyberpunk';

interface InputFormProps {
  onGenerateText: (
    content: string, 
    tone: Tone, 
    audience: string,
    imageStyle: ImageStyle,
  ) => void;
  onGenerateImageAndReview: (
    logo: File | null, 
    background: BackgroundChoice,
    socialHandles: SocialHandle[],
    template: DesignTemplate,
    brandColor: string,
    font: FontStyle,
  ) => void;
  brandKits: BrandKit[];
  onOpenBrandKitManager: () => void;
  selectedKitName: string;
  onSelectKitName: (name: string) => void;
  step: AppStep;
  textResult: GeneratedTextContent | null;
}

const base64ToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error('Invalid Data URL: MIME type not found');
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const libraryImages = [
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579165466949-3180a3d056d5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512758017271-d7b53c796ee2?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598428989218-5a0834614949?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601831201889-a8e7fab96377?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508249332592-8a9a2a9d4536?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503572327579-b5c6afe0c5c5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1624235332211-23642345e691?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587973302633-88a442a8a8c1?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1563968434674-3d07a1f5f3e1?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1554494583-499315d81d23?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505682499293-233fb141754c?q=80&w=1200&auto=format&fit=crop',
];

const templates: { name: DesignTemplate, Icon: React.FC<any> }[] = [
    { name: 'classic', Icon: ClassicLayoutIcon },
    { name: 'top-bar', Icon: TopBarLayoutIcon },
    { name: 'heavy-bottom', Icon: HeavyBottomLayoutIcon },
    { name: 'split-vertical', Icon: SplitVerticalLayoutIcon },
    { name: 'minimal', Icon: MinimalLayoutIcon },
    { name: 'framed', Icon: FramedLayoutIcon },
    { name: 'quote-focus', Icon: QuoteFocusLayoutIcon },
    { name: 'news-banner', Icon: NewsBannerLayoutIcon },
];

const fontDisplayNames: Record<FontStyle, string> = {
    'sans-serif': 'Sans Serif',
    'serif': 'Serif',
    'monospace': 'Monospace',
    'jameel-noori': 'Jameel Noori',
    'mb-sindhi': 'MB Sindhi',
};

const FetchSpinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
);

const socialPlatforms: { value: SocialPlatform, label: string }[] = [
    { value: 'x', label: 'X (Twitter)' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'website', label: 'Website' },
];

export const InputForm: React.FC<InputFormProps> = ({ 
    onGenerateText, 
    onGenerateImageAndReview, 
    brandKits, 
    onOpenBrandKitManager, 
    selectedKitName, 
    onSelectKitName, 
    step, 
    textResult 
}) => {
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
  const [imagePrompt, setImagePrompt] = useState('');
  
  const [url, setUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState('');

  const [socialHandles, setSocialHandles] = useState<SocialHandle[]>([]);
  const [brandColor, setBrandColor] = useState('#B91C1C');
  const [font, setFont] = useState<FontStyle>('sans-serif');
  const [template, setTemplate] = useState<DesignTemplate>('classic');


  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  
  const isTextGenerated = step === 'text-generated';

  useEffect(() => {
    return () => {
      backgroundImagePreviews.forEach(url => URL.revokeObjectURL(url));
      if (logoPreview && logoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [backgroundImagePreviews, logoPreview]);
  
  useEffect(() => {
    if (selectedKitName) {
      const kit = brandKits.find(k => k.name === selectedKitName);
      if (kit) {
        if (typeof kit.logo !== 'string' || !kit.logo.startsWith('data:image')) {
            console.error("Invalid logo format in brand kit:", kit.name);
            setError(`The logo for brand kit '${kit.name}' is invalid or missing.`);
            setLogo(null);
            setLogoPreview(null);
            return; // Exit early if logo is invalid
        }
        try {
            const mimeType = kit.logo.split(';')[0].split('/')[1];
            const extension = mimeType || 'png';
            const kitLogoFile = base64ToFile(kit.logo, `logo_${kit.name}.${extension}`);
            
            setLogo(kitLogoFile);
            setLogoPreview(kit.logo);
            setSocialHandles(kit.socialHandles || []);
            setBrandColor(kit.brandColor);
            setFont(kit.font);
            setTemplate(kit.template);
            setError(''); // Clear previous errors
        } catch (e) {
            console.error("Error converting brand kit logo:", e);
            setError(`Could not load logo from '${kit.name}' kit. The saved logo data may be corrupted.`);
            setLogo(null);
            setLogoPreview(null);
        }
      }
    } else {
        // When no kit is selected, don't clear manual settings.
        // The user might have deselected a kit to start customizing.
    }
  }, [selectedKitName, brandKits]);

  useEffect(() => {
    if (textResult && isTextGenerated) {
        setImagePrompt(textResult.imagePrompt);
    }
  }, [textResult, isTextGenerated]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (type === 'logo') {
        const file = files.item(0);
        if (file && file.type.startsWith('image/')) {
            setLogo(file);
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(URL.createObjectURL(file));
            onSelectKitName(''); // Deselect kit on manual upload
            setError('');
        } else {
            setError('Please upload a valid image file for the logo (PNG, JPG, etc.).');
            setLogo(null);
            setLogoPreview(null);
        }
    } else { 
        const imageFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file && file.type.startsWith('image/')) {
                imageFiles.push(file);
            }
        }

        if (imageFiles.length > 0) {
            const newFiles = [...backgroundImageFiles, ...imageFiles];
            setBackgroundImageFiles(newFiles);
            const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
            setBackgroundImagePreviews(prev => [...prev, ...newPreviews]);
            if (selectedUploadIndex === null) setSelectedUploadIndex(0);
            setBackgroundSource('upload');
            setError('');
        }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLElement>) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent<HTMLElement>, type: 'logo' | 'background') => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      if (type === 'logo') {
        const file = files.item(0);
        if (file && file.type.startsWith('image/')) {
            setLogo(file);
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(URL.createObjectURL(file));
            onSelectKitName('');
            setError('');
        } else {
            setError('Please upload a valid image file for the logo (PNG, JPG, etc.).');
            setLogo(null);
            setLogoPreview(null);
        }
      } else { 
        const imageFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file && file.type.startsWith('image/')) {
                imageFiles.push(file);
            }
        }
        if (imageFiles.length > 0) {
            const newFiles = [...backgroundImageFiles, ...imageFiles];
            setBackgroundImageFiles(newFiles);
            const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
            setBackgroundImagePreviews(prev => [...prev, ...newPreviews]);
            if (selectedUploadIndex === null) setSelectedUploadIndex(0);
            setBackgroundSource('upload');
            setError('');
        }
      }
  };

  const handleFetchUrl = async () => {
    if (!url.trim()) {
        setUrlError('Please enter a valid URL.');
        return;
    }
    setUrlError('');
    setIsFetchingUrl(true);
    try {
        const fetchedContent = await getContentFromURL(url);
        setContent(fetchedContent);
    } catch (e) {
        const message = e instanceof Error ? e.message : 'An unknown error occurred.';
        setUrlError(message);
    } finally {
        setIsFetchingUrl(false);
    }
  };

  const addSocialHandle = () => {
    setSocialHandles([...socialHandles, { id: Date.now().toString(), platform: 'x', username: '' }]);
    onSelectKitName('');
  };

  const updateSocialHandle = (id: string, field: 'platform' | 'username', value: string) => {
    setSocialHandles(socialHandles.map(h => h.id === id ? { ...h, [field]: value } : h));
    onSelectKitName('');
  };

  const removeSocialHandle = (id: string) => {
    setSocialHandles(socialHandles.filter(h => h.id !== id));
    onSelectKitName('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (step === 'input') {
        if (!content.trim()) {
            setError('Please provide some content for the post.');
            return;
        }
        setError('');
        onGenerateText(content, tone, audience, imageStyle);
    } else if (step === 'text-generated') {
        const hasEmptyUsername = socialHandles.some(handle => !handle.username.trim());
        if (hasEmptyUsername) {
            setError('Please provide a username for each social handle, or remove the empty ones.');
            return;
        }
        
        let background: BackgroundChoice;
        if (backgroundSource === 'ai') {
            if (!imagePrompt.trim()) {
                setError('Please provide a prompt for the AI-generated image.');
                return;
            }
            background = { type: 'ai', prompt: imagePrompt };
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
        onGenerateImageAndReview(logo, background, socialHandles, template, brandColor, font);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Brand Kit */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            1. Select Brand Kit (Optional)
          </label>
          <div className="flex gap-2">
            <select
              value={selectedKitName}
              onChange={(e) => onSelectKitName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
            >
              <option value="">-- No Brand Kit / Custom --</option>
              {brandKits.map(kit => (
                <option key={kit.name} value={kit.name}>{kit.name}</option>
              ))}
            </select>
            <button
                type="button"
                onClick={onOpenBrandKitManager}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
            >
                Manage
            </button>
          </div>
        </div>

        {/* Step 2: Branding & Style */}
        <fieldset className="bg-gray-900 p-4 rounded-lg border border-gray-600 space-y-4">
            <legend className="text-sm font-medium text-gray-300 px-2">2. Branding & Style</legend>
            
            {/* Logo */}
            <div>
                <label className="text-xs font-medium text-gray-400">Brand Logo (Optional)</label>
                <label 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'logo')}
                    htmlFor="logo-upload" 
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md transition-colors cursor-pointer hover:border-indigo-500"
                >
                    <div className="space-y-1 text-center">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo Preview" className="mx-auto h-16 w-auto object-contain" />
                        ) : (
                            <UploadIcon className="mx-auto h-10 w-10 text-gray-500" />
                        )}
                        <div className="flex text-sm text-gray-400">
                            <p className="pl-1">{logo ? 'Change logo' : 'Upload or drag and drop'}</p>
                        </div>
                        <p className="text-xs text-gray-500">{selectedKitName ? `Using '${selectedKitName}' kit` : 'PNG, JPG, etc.'}</p>
                    </div>
                    <input id="logo-upload" name="logo-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} ref={logoInputRef} />
                </label>
            </div>

            {/* Template, Color, Font */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="brand-color" className="text-xs font-medium text-gray-400 block mb-1">Brand Color</label>
                  <input id="brand-color" type="color" value={brandColor} onChange={(e) => {setBrandColor(e.target.value); onSelectKitName('');}} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-400">Font Style</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(Object.keys(fontDisplayNames) as FontStyle[]).map(f => (
                      <button key={f} type="button" onClick={() => {setFont(f); onSelectKitName('');}} className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-lg ${font === f ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                        {fontDisplayNames[f]}
                      </button>
                    ))}
                  </div>
                </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400">Template</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-1">
                {templates.map(({ name, Icon }) => (
                  <button key={name} type="button" onClick={() => {setTemplate(name); onSelectKitName('');}} className={`p-2 rounded-lg transition-colors aspect-square flex items-center justify-center ${template === name ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`} title={name}>
                    <Icon className="w-7 h-7" />
                  </button>
                ))}
              </div>
            </div>

            {/* Social Handles */}
            <div>
                <label className="text-xs font-medium text-gray-400">Social Handles</label>
                <div className="space-y-2 mt-1">
                    {socialHandles.map((handle) => (
                        <div key={handle.id} className="flex items-center gap-2">
                            <select
                                value={handle.platform}
                                onChange={(e) => updateSocialHandle(handle.id, 'platform', e.target.value as SocialPlatform)}
                                className="bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 capitalize"
                            >
                                {socialPlatforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>
                            <input
                                type="text"
                                value={handle.username}
                                onChange={(e) => updateSocialHandle(handle.id, 'username', e.target.value)}
                                placeholder="your-handle"
                                className={`flex-grow bg-gray-700 border rounded-lg p-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 transition ${!handle.username.trim() ? 'border-red-500/60 focus:border-red-500' : 'border-gray-600 focus:border-indigo-500'}`}
                            />
                            <button type="button" onClick={() => removeSocialHandle(handle.id)} className="p-2 text-gray-500 hover:text-red-400 rounded-full transition-colors">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                     <button type="button" onClick={addSocialHandle} className="w-full text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors py-1">
                        + Add Handle
                    </button>
                </div>
            </div>
        </fieldset>

        {/* Step 3: Content */}
        <fieldset disabled={isTextGenerated}>
             <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    3. Provide Your Content
                </label>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600 space-y-4">
                    <div>
                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Or paste a URL to fetch content..."
                                className="w-full bg-gray-700 border border-gray-500 rounded-lg p-3 pl-10 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                                disabled={isFetchingUrl}
                            />
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        {urlError && <p className="text-red-400 text-sm mt-2">{urlError}</p>}
                        <button
                            type="button"
                            onClick={handleFetchUrl}
                            disabled={isFetchingUrl}
                            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 transition disabled:opacity-50"
                        >
                            {isFetchingUrl ? <FetchSpinner/> : 'Fetch Content'}
                        </button>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <hr className="w-full border-gray-600" />
                        <span className="px-2 text-xs font-semibold">OR</span>
                        <hr className="w-full border-gray-600" />
                    </div>
                    <textarea
                        id="content"
                        rows={8}
                        className="w-full bg-gray-700 border border-gray-500 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                        placeholder="Paste the news article, press release, or any text here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </div>
        </fieldset>
       
        {/* Step 4: Tone & Audience */}
        <fieldset disabled={isTextGenerated}>
            <div>
                <h3 className="block text-sm font-medium text-gray-300 mb-2">
                    4. Define Tone &amp; Audience
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
                            className="w-full mt-1 bg-gray-700 border border-gray-500 rounded-lg p-2 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                            placeholder="e.g., Tech enthusiasts, general public, investors"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </fieldset>

        {/* Step 5: Background */}
        <div>
            <h3 className="block text-sm font-medium text-gray-300 mb-2">
                5. Choose a Background
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
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 h-48 overflow-y-auto p-2 bg-gray-800/50 rounded-lg">
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
                    <div className="bg-gray-800/50 p-4 rounded-lg mt-2 space-y-4 border border-gray-700">
                         {isTextGenerated && (
                            <div>
                                <label htmlFor="imagePrompt" className="text-sm font-medium text-gray-300">Image Prompt (edit as needed)</label>
                                <textarea
                                    id="imagePrompt"
                                    rows={4}
                                    className="w-full mt-2 bg-gray-700 border border-gray-500 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                />
                            </div>
                         )}
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
        
        {isTextGenerated && (
            <div className="bg-green-900/50 border border-green-500/50 text-green-300 text-sm p-4 rounded-lg text-center animate-fade-in">
                Text content generated! Review your branding and background, then proceed.
            </div>
        )}

        <div className="pt-4">
            <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
            >
                {isTextGenerated ? <><MagicWandIcon className="w-5 h-5" /> Generate Image & Review</> : <><SparklesIcon className="w-5 h-5" /> Generate Text & Prompt</> }
            </button>
        </div>

        {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
};