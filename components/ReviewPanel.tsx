
import React, { useState, useEffect } from 'react';
import type { GeneratedTextContent, LogoPosition, DesignTemplate, FontStyle, BrandKit, SocialHandle, SocialPlatform, AspectRatio } from '../types';
import { getTemplateDefaults, fontDisplayNames, socialPlatforms, isRtl } from '../types';
import { DownloadIcon, ClipboardIcon, CheckIcon, RedoIcon, MagicWandIcon, TrashIcon, PencilIcon, XIcon, InstagramIcon, FacebookIcon, LinkedInIcon, WebsiteIcon, ChevronDownIcon, LogoPositionIcon, AspectRatioIcon, templates } from './icons';
import { rewriteHeadline } from '../services/geminiService';

interface ReviewPanelProps {
  content: GeneratedTextContent;
  initialFinalImage: string;
  baseImageSrc: string;
  logoFile: File | null;
  onStartOver: () => void;
  originalContent: string;
  combineImages: (baseImageSrc: string, logoFile: File | null, headline: string, logoPosition: LogoPosition, fontFamily: string, template: DesignTemplate, brandColor: string, fontSizeMultiplier: number, textColor: string, textShadow: boolean, socialHandles: SocialHandle[], aspectRatio: AspectRatio) => Promise<string>;
  backgroundType: 'ai' | 'upload' | 'library';
  onRegenerateImage: (prompt: string) => void;
  isRegeneratingImage: boolean;
  onSaveBrandKit: (kitData: { name: string; logoFile: File; brandColor: string; font: FontStyle; template: DesignTemplate; socialHandles: SocialHandle[]; }) => void;
  initialBrandColor?: string;
  initialFont?: FontStyle;
  initialTemplate?: DesignTemplate;
  initialSocialHandles?: SocialHandle[];
  brandKits: BrandKit[];
}

const fontStyles: Record<FontStyle, React.CSSProperties> = {
  'sans-serif': { fontFamily: "'Noto Sans', sans-serif" },
  'serif': { fontFamily: "'Noto Serif', serif" },
  'monospace': { fontFamily: "'Noto Sans Mono', monospace" },
  'jameel-noori': { fontFamily: "'Jameel Noori Nastaleeq', cursive" },
  'mb-sindhi': { fontFamily: "'MB Sindhi', sans-serif" },
};

const logoPositions: LogoPosition[] = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'];
const aspectRatios: AspectRatio[] = ['1:1', '4:5', '16:9'];

const CopyableField: React.FC<{ text: string; style: React.CSSProperties }> = ({ text, style }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const textIsRtl = isRtl(text);
    const pStyle: React.CSSProperties = {
        ...style,
        direction: textIsRtl ? 'rtl' : 'ltr',
        textAlign: textIsRtl ? 'right' : 'left',
    };

    return (
        <div className="relative">
            <p className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-gray-300 pr-12" style={pStyle}>{text}</p>
            <button
                onClick={handleCopy}
                className="absolute top-1/2 right-3 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition"
                aria-label="Copy to clipboard"
            >
                {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

const RewriteSpinner: React.FC = () => (
    <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-indigo-400"></div>
);

const HeadlineEditor: React.FC<{
    id: 'h1' | 'h2';
    value: string;
    onChange: (value: string) => void;
    onRewrite: () => void;
    onSelect: () => void;
    isSelected: boolean;
    isRewriting: boolean;
    fontStyle: React.CSSProperties;
}> = ({ id, value, onChange, onRewrite, onSelect, isSelected, isRewriting, fontStyle }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const textIsRtl = isRtl(value);
    const inputStyle: React.CSSProperties = {
        ...fontStyle,
        direction: textIsRtl ? 'rtl' : 'ltr',
        textAlign: textIsRtl ? 'right' : 'left',
    };

    return (
        <div className="flex items-center gap-3">
            <input 
                type="radio" 
                id={`select-${id}`} 
                name="selectedHeadline" 
                value={id}
                checked={isSelected}
                onChange={onSelect}
                aria-label={`Select headline ${id === 'h1' ? 1 : 2} for image`}
                className="form-radio h-5 w-5 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 shrink-0"
            />
            <div className="relative flex-grow">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 pr-24 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    style={inputStyle}
                />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                    <button onClick={handleCopy} className="p-2 text-gray-400 hover:text-white transition" aria-label="Copy headline">
                        {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardIcon className="w-5 h-5" />}
                    </button>
                    <button onClick={onRewrite} disabled={isRewriting} className="p-2 text-gray-400 hover:text-indigo-400 transition disabled:opacity-50" aria-label="Rewrite headline">
                        {isRewriting ? <RewriteSpinner /> : <MagicWandIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

const SocialIcon: React.FC<{ platform: SocialPlatform; className?: string }> = ({ platform, className }) => {
    const icons: Record<SocialPlatform, React.FC<any>> = {
        'x': XIcon,
        'instagram': InstagramIcon,
        'facebook': FacebookIcon,
        'linkedin': LinkedInIcon,
        'website': WebsiteIcon,
    };
    const IconComponent = icons[platform];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
};

const MIN_FONT_MULTIPLIER = 0.5;
const MAX_FONT_MULTIPLIER = 2.0;
const FONT_STEP = 0.1;
const BASE_FONT_SIZE = 49; // Based on a 1080px canvas: Math.max(24, Math.round(1080 / 22))

export const ReviewPanel: React.FC<ReviewPanelProps> = ({ 
    content, 
    initialFinalImage, 
    baseImageSrc, 
    logoFile, 
    onStartOver, 
    originalContent, 
    combineImages, 
    backgroundType, 
    onRegenerateImage, 
    isRegeneratingImage,
    onSaveBrandKit,
    initialBrandColor,
    initialFont,
    initialTemplate,
    initialSocialHandles,
    brandKits
}) => {
  const [headline1, setHeadline1] = useState(content.headline1);
  const [headline2, setHeadline2] = useState(content.headline2);
  const [finalImage, setFinalImage] = useState(initialFinalImage);
  const [isCombining, setIsCombining] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState<'h1' | 'h2'>('h1');
  const { about, hashtags, imagePrompt } = content;
  const [selectedFont, setSelectedFont] = useState<FontStyle>(initialFont || 'sans-serif');
  const [rewriting, setRewriting] = useState<'h1' | 'h2' | null>(null);
  const [rewriteError, setRewriteError] = useState<string | null>(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate>(initialTemplate || 'classic');
  
  // Get initial defaults based on the initial template
  const initialDefaults = getTemplateDefaults(selectedTemplate);

  const [logoPosition, setLogoPosition] = useState<LogoPosition>(initialDefaults.logoPosition);
  const [brandColor, setBrandColor] = useState(initialBrandColor || '#B91C1C');
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(initialDefaults.fontSizeMultiplier);
  const [textColor, setTextColor] = useState(initialDefaults.textColor);
  const [textShadow, setTextShadow] = useState(initialDefaults.textShadow);
  const [socialHandles, setSocialHandles] = useState<SocialHandle[]>(initialSocialHandles || []);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  const [sizeMode, setSizeMode] = useState<'px' | 'multiplier'>('px');
  const [sizeInput, setSizeInput] = useState(String(Math.round(initialDefaults.fontSizeMultiplier * BASE_FONT_SIZE)));

  const [newKitName, setNewKitName] = useState('');
  const [kitSaveMessage, setKitSaveMessage] = useState('');
  const [isConfirmingOverwrite, setIsConfirmingOverwrite] = useState(false);

  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [currentImagePrompt, setCurrentImagePrompt] = useState(imagePrompt);
  const [socialHandleFeedback, setSocialHandleFeedback] = useState('');


  const headlineToRender = selectedHeadline === 'h1' ? headline1 : headline2;
  
  const handleMultiplierChange = (newMultiplier: number) => {
    if (isNaN(newMultiplier)) return;
    const clampedMultiplier = Math.max(MIN_FONT_MULTIPLIER, Math.min(MAX_FONT_MULTIPLIER, newMultiplier));
    setFontSizeMultiplier(clampedMultiplier);
  };
  
  useEffect(() => {
    if (sizeMode === 'px') {
        setSizeInput(String(Math.round(fontSizeMultiplier * BASE_FONT_SIZE)));
    } else {
        setSizeInput(fontSizeMultiplier.toFixed(2));
    }
  }, [fontSizeMultiplier, sizeMode]);
  
  const handleSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSizeInput(val);
    if (sizeMode === 'px') {
        const numVal = parseInt(val, 10);
        if (!isNaN(numVal) && numVal > 0) {
            const newMultiplier = numVal / BASE_FONT_SIZE;
            handleMultiplierChange(newMultiplier);
        }
    } else { // multiplier mode
        const floatVal = parseFloat(val);
        if (!isNaN(floatVal)) {
            handleMultiplierChange(floatVal);
        }
    }
  };

  const handleSizeInputBlur = () => {
      const val = sizeMode === 'px' ? parseInt(sizeInput, 10) : parseFloat(sizeInput);
      if (isNaN(val) || (sizeMode === 'px' && val <= 0)) {
          if (sizeMode === 'px') {
              setSizeInput(String(Math.round(fontSizeMultiplier * BASE_FONT_SIZE)));
          } else {
              setSizeInput(fontSizeMultiplier.toFixed(2));
          }
      }
  };

  useEffect(() => {
    // When the template changes, reset other controls to good defaults for that template.
    const newDefaults = getTemplateDefaults(selectedTemplate);
    setLogoPosition(newDefaults.logoPosition);
    setFontSizeMultiplier(newDefaults.fontSizeMultiplier);
    setTextColor(newDefaults.textColor);
    setTextShadow(newDefaults.textShadow);
  }, [selectedTemplate]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const regenerateImage = async () => {
        if (!baseImageSrc || !headlineToRender.trim()) return;
        setIsCombining(true);
        try {
          const fontFamily = fontStyles[selectedFont].fontFamily as string;
          const newImage = await combineImages(baseImageSrc, logoFile, headlineToRender, logoPosition, fontFamily, selectedTemplate, brandColor, fontSizeMultiplier, textColor, textShadow, socialHandles, aspectRatio);
          setFinalImage(newImage);
        } catch (error) {
          console.error("Failed to regenerate image:", error);
        } finally {
          setIsCombining(false);
        }
      };
      regenerateImage();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [headlineToRender, logoPosition, baseImageSrc, logoFile, combineImages, selectedFont, selectedTemplate, brandColor, fontSizeMultiplier, textColor, textShadow, socialHandles, aspectRatio]);
  
  useEffect(() => {
    setCurrentImagePrompt(imagePrompt);
  }, [imagePrompt]);

  const handleRewrite = async (headlineToRewrite: 'h1' | 'h2') => {
    setRewriting(headlineToRewrite);
    setRewriteError(null);
    try {
      const existingHeadlines = [headline1, headline2];
      const newHeadline = await rewriteHeadline(originalContent, existingHeadlines);
      if (headlineToRewrite === 'h1') {
        setHeadline1(newHeadline);
      } else {
        setHeadline2(newHeadline);
      }
    } catch (error) {
      console.error("Failed to rewrite headline:", error);
      setRewriteError("Couldn't generate a new headline. Please try again.");
      setTimeout(() => setRewriteError(null), 3000);
    } finally {
      setRewriting(null);
    }
  };
  
  const handlePromptRegenerate = () => {
    onRegenerateImage(currentImagePrompt);
    setIsEditingPrompt(false);
  };

  const performSave = () => {
    const trimmedName = newKitName.trim();
    if (!logoFile) {
        setKitSaveMessage('A logo is required to save a brand kit.');
        setTimeout(() => setKitSaveMessage(''), 3000);
        return;
    }
    if (!trimmedName) {
        setKitSaveMessage('Please enter a name for your brand kit.');
        setTimeout(() => setKitSaveMessage(''), 3000);
        return;
    }
    onSaveBrandKit({
        name: trimmedName,
        logoFile: logoFile,
        brandColor: brandColor,
        font: selectedFont,
        template: selectedTemplate,
        socialHandles: socialHandles,
    });
    setKitSaveMessage(`Brand kit '${trimmedName}' saved successfully!`);
    setNewKitName('');
    setIsConfirmingOverwrite(false);
    setTimeout(() => {
        setKitSaveMessage('');
    }, 3000);
  };

  const handleSaveKit = () => {
    const trimmedName = newKitName.trim();
    if (!logoFile) {
      setKitSaveMessage('A logo is required to save a brand kit.');
      setTimeout(() => setKitSaveMessage(''), 3000);
      return;
    }
    if (!trimmedName) {
      setKitSaveMessage('Please enter a name for your brand kit.');
      setTimeout(() => setKitSaveMessage(''), 3000);
      return;
    }
    
    const kitExists = brandKits.some(kit => kit.name === trimmedName);

    if (kitExists) {
      setIsConfirmingOverwrite(true);
      setKitSaveMessage(`A kit named '${trimmedName}' already exists. Overwrite it?`);
    } else {
      performSave();
    }
  };

  const handleConfirmOverwrite = () => {
    performSave();
  };

  const handleCancelOverwrite = () => {
    setIsConfirmingOverwrite(false);
    setKitSaveMessage('');
  };

  const addSocialHandle = () => {
    setSocialHandles(prevHandles => [...prevHandles, { id: Date.now().toString(), platform: 'x', username: '' }]);
    setSocialHandleFeedback('Handle added.');
    setTimeout(() => setSocialHandleFeedback(''), 2000);
  };

  const updateSocialHandle = (id: string, field: 'platform' | 'username', value: string) => {
    setSocialHandles(prevHandles => prevHandles.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const removeSocialHandle = (id: string) => {
    setSocialHandles(prevHandles => prevHandles.filter(h => h.id !== id));
    setSocialHandleFeedback('Handle removed.');
    setTimeout(() => setSocialHandleFeedback(''), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
      {/* Left side: Image and actions */}
      <div className="space-y-4">
        <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700">
            <div className={`relative w-full mx-auto ${aspectRatio === '1:1' ? 'aspect-square' : aspectRatio === '4:5' ? 'aspect-[4/5]' : 'aspect-video'}`}>
              {isCombining || isRegeneratingImage ? (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                </div>
              ) : null}
              <img src={finalImage} alt="Generated social media post" className="w-full h-full object-cover" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <a
            href={finalImage}
            download="social_post.png"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
          >
            <DownloadIcon className="w-5 h-5" /> Download
          </a>
          <button
            onClick={onStartOver}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
          >
            Start Over
          </button>
        </div>
        {backgroundType === 'ai' && (
            <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700 space-y-3">
                {isEditingPrompt ? (
                    <div className="animate-fade-in-fast space-y-2">
                        <label htmlFor="imagePrompt" className="text-sm font-medium text-gray-300">Edit Image Prompt</label>
                        <textarea
                            id="imagePrompt"
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-500 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-50"
                            value={currentImagePrompt}
                            onChange={(e) => setCurrentImagePrompt(e.target.value)}
                            disabled={isRegeneratingImage}
                        />
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => setIsEditingPrompt(false)} 
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
                                disabled={isRegeneratingImage}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePromptRegenerate} 
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
                                disabled={isRegeneratingImage}
                            >
                                {isRegeneratingImage ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    'Regenerate'
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                     <button
                        onClick={() => setIsEditingPrompt(true)}
                        disabled={isRegeneratingImage}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <PencilIcon className="w-5 h-5" />
                        Edit & Regenerate Background
                    </button>
                )}
            </div>
        )}
      </div>

      {/* Right side: Text and customization */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">1. Edit Headlines</h3>
          <div className="space-y-3">
            <HeadlineEditor id="h1" value={headline1} onChange={setHeadline1} onRewrite={() => handleRewrite('h1')} onSelect={() => setSelectedHeadline('h1')} isSelected={selectedHeadline === 'h1'} isRewriting={rewriting === 'h1'} fontStyle={fontStyles[selectedFont]} />
            <HeadlineEditor id="h2" value={headline2} onChange={setHeadline2} onRewrite={() => handleRewrite('h2')} onSelect={() => setSelectedHeadline('h2')} isSelected={selectedHeadline === 'h2'} isRewriting={rewriting === 'h2'} fontStyle={fontStyles[selectedFont]} />
            {rewriteError && <p className="text-red-400 text-sm text-center">{rewriteError}</p>}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">2. Select Template</h3>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-2">
              {templates.map(({ name, Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedTemplate(name)}
                  className={`p-2 rounded-lg transition-colors aspect-square flex items-center justify-center ${selectedTemplate === name ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                  title={name}
                >
                  <Icon className="w-7 h-7" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">3. Customize Details</h3>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="brand-color-review" className="text-sm font-medium text-gray-400 block mb-2">Brand Color</label>
                <input id="brand-color-review" type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer" />
              </div>
               <div>
                <label htmlFor="text-color-review" className="text-sm font-medium text-gray-400 block mb-2">Text Color</label>
                <input id="text-color-review" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400 block mb-2">Font Style</label>
              <select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value as FontStyle)} className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg p-2 text-gray-200 focus:ring-2 focus:ring-indigo-500">
                  {Object.entries(fontDisplayNames).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Aspect Ratio</label>
              <div className="flex justify-between items-center gap-2 mt-2">
                {aspectRatios.map(ratio => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`p-2 rounded-lg transition-colors aspect-square flex items-center justify-center w-full ${aspectRatio === ratio ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    title={`Ratio ${ratio}`}
                  >
                    <AspectRatioIcon ratio={ratio} className="w-8 h-8" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-400">Logo Position</label>
              <div className="flex justify-between items-center gap-2 mt-2">
                {logoPositions.map(pos => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setLogoPosition(pos)}
                    className={`p-2 rounded-lg transition-colors aspect-square flex items-center justify-center w-full ${logoPosition === pos ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                    title={pos.replace('-', ' ')}
                  >
                    <LogoPositionIcon position={pos} className="w-7 h-7" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
                <div className="flex-grow">
                    <div className="flex justify-between items-baseline">
                        <label htmlFor="font-size" className="text-sm font-medium text-gray-400">Font Size</label>
                        <span className="text-xs font-mono text-gray-500">Multiplier: {fontSizeMultiplier.toFixed(2)}x</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleMultiplierChange(fontSizeMultiplier - FONT_STEP)} className="px-2 py-1 text-lg bg-gray-700 rounded-md hover:bg-gray-600">-</button>
                        <input 
                            id="font-size"
                            type="range"
                            min={MIN_FONT_MULTIPLIER}
                            max={MAX_FONT_MULTIPLIER}
                            step={FONT_STEP / 10}
                            value={fontSizeMultiplier}
                            onChange={(e) => handleMultiplierChange(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                        <button onClick={() => handleMultiplierChange(fontSizeMultiplier + FONT_STEP)} className="px-2 py-1 text-lg bg-gray-700 rounded-md hover:bg-gray-600">+</button>
                         <div className="relative w-24">
                            <input
                                type="number"
                                value={sizeInput}
                                onChange={handleSizeInputChange}
                                onBlur={handleSizeInputBlur}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-center text-gray-200 focus:ring-2 focus:ring-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button onClick={() => setSizeMode(s => s === 'px' ? 'multiplier' : 'px')} className="absolute right-1 top-1/2 -translate-y-1/2 text-xs bg-gray-600/50 text-gray-400 px-1 rounded hover:bg-gray-500/50">
                                {sizeMode}
                            </button>
                         </div>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0">
                    <label className="text-sm font-medium text-gray-400 block mb-2">Text Shadow</label>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={textShadow}
                        onClick={() => setTextShadow(!textShadow)}
                        className={`relative inline-flex flex-shrink-0 h-8 w-14 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 ${
                            textShadow ? 'bg-indigo-600' : 'bg-gray-700'
                        }`}
                    >
                        <span className="sr-only">Toggle text shadow</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200 ${
                            textShadow ? 'translate-x-6' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-400">Social Handles</label>
                <div className="space-y-2 mt-2">
                    {socialHandles.map((handle) => (
                        <div key={handle.id} className="flex items-center gap-2">
                             <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <SocialIcon platform={handle.platform} className="w-5 h-5 text-gray-400" />
                                </div>
                                <select
                                    value={handle.platform}
                                    onChange={(e) => updateSocialHandle(handle.id, 'platform', e.target.value as SocialPlatform)}
                                    className="bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-8 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500 capitalize appearance-none"
                                >
                                    {socialPlatforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
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
                     <div>
                        <button type="button" onClick={addSocialHandle} className="w-full text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors py-1">
                            + Add Handle
                        </button>
                        <div className="h-4 mt-1 text-center">
                            {socialHandleFeedback && (
                                <p className="text-xs text-green-400 animate-fade-in-fast">
                                    {socialHandleFeedback}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-2">4. Save Brand Kit</h3>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newKitName}
                    onChange={(e) => {
                        setNewKitName(e.target.value);
                        if (isConfirmingOverwrite) {
                            setIsConfirmingOverwrite(false);
                            setKitSaveMessage('');
                        }
                    }}
                    placeholder="New Kit Name..."
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-gray-200 focus:ring-2 focus:ring-indigo-500"
                />
                 <button onClick={handleSaveKit} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    Save
                </button>
            </div>
            {isConfirmingOverwrite && (
                <div className="mt-2 flex gap-2 justify-end animate-fade-in-fast">
                    <button onClick={handleCancelOverwrite} className="px-3 py-1 text-xs text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500">Cancel</button>
                    <button onClick={handleConfirmOverwrite} className="px-3 py-1 text-xs text-white bg-red-600 rounded-md hover:bg-red-700">Overwrite</button>
                </div>
            )}
            {kitSaveMessage && <p className={`text-sm mt-2 ${isConfirmingOverwrite ? 'text-yellow-400' : 'text-green-400'}`}>{kitSaveMessage}</p>}
          </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">5. Final Content</h3>
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-400">About</label>
                    <CopyableField text={about} style={fontStyles[selectedFont]} />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-400">Hashtags</label>
                    <CopyableField text={hashtags} style={{fontFamily: "'Noto Sans Mono', monospace"}}/>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
