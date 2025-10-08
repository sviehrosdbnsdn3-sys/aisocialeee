
import React, { useState, useEffect } from 'react';
import type { GeneratedTextContent } from '../types';
import type { LogoPosition, BackgroundChoice } from '../App';
import { DownloadIcon, ClipboardIcon, CheckIcon, RedoIcon, MagicWandIcon } from './icons';
import { rewriteHeadline } from '../services/geminiService';

interface ReviewPanelProps {
  content: GeneratedTextContent;
  initialFinalImage: string;
  baseImageSrc: string;
  logoFile: File;
  onStartOver: () => void;
  originalContent: string;
  combineImages: (baseImageSrc: string, logoFile: File, headline: string, logoPosition: LogoPosition, fontFamily: string) => Promise<string>;
  backgroundType: BackgroundChoice['type'];
  onRegenerateImage: () => void;
  isRegeneratingImage: boolean;
}

type FontStyle = 'sans-serif' | 'serif' | 'monospace' | 'jameel-noori' | 'mb-sindhi';

const fontStyles: Record<FontStyle, React.CSSProperties> = {
  'sans-serif': { fontFamily: "'Noto Sans', sans-serif" },
  'serif': { fontFamily: "'Noto Serif', serif" },
  'monospace': { fontFamily: "'Noto Sans Mono', monospace" },
  'jameel-noori': { fontFamily: "'Jameel Noori Nastaleeq', cursive" },
  'mb-sindhi': { fontFamily: "'MB Sindhi', sans-serif" },
};

const fontDisplayNames: Record<FontStyle, string> = {
    'sans-serif': 'Sans Serif',
    'serif': 'Serif',
    'monospace': 'Monospace',
    'jameel-noori': 'Jameel Noori',
    'mb-sindhi': 'MB Sindhi',
};

const isRtl = (text: string) => {
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text);
};

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

export const ReviewPanel: React.FC<ReviewPanelProps> = ({ content, initialFinalImage, baseImageSrc, logoFile, onStartOver, originalContent, combineImages, backgroundType, onRegenerateImage, isRegeneratingImage }) => {
  const [headline1, setHeadline1] = useState(content.headline1);
  const [headline2, setHeadline2] = useState(content.headline2);
  const [finalImage, setFinalImage] = useState(initialFinalImage);
  const [isCombining, setIsCombining] = useState(false);
  const [selectedHeadline, setSelectedHeadline] = useState<'h1' | 'h2'>('h1');
  const { about } = content;
  const [selectedFont, setSelectedFont] = useState<FontStyle>('sans-serif');
  const [rewriting, setRewriting] = useState<'h1' | 'h2' | null>(null);
  const [rewriteError, setRewriteError] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>('bottom-right');

  const headlineToRender = selectedHeadline === 'h1' ? headline1 : headline2;

  useEffect(() => {
    const handler = setTimeout(() => {
      const regenerateImage = async () => {
        if (!baseImageSrc || !logoFile || !headlineToRender.trim()) return;
        setIsCombining(true);
        try {
          const fontFamily = fontStyles[selectedFont].fontFamily as string;
          const newImage = await combineImages(baseImageSrc, logoFile, headlineToRender, logoPosition, fontFamily);
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
  }, [headlineToRender, logoPosition, baseImageSrc, logoFile, combineImages, selectedFont]);

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


  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = finalImage;
    link.download = 'generated-post-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const logoPositions: (LogoPosition | null)[] = [
    'top-left', null, 'top-right',
    null, 'center', null,
    'bottom-left', null, 'bottom-right'
  ];

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Your Post is Ready!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side: Image */}
        <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-between items-center w-full mb-2">
                <h3 className="text-lg font-semibold text-gray-300">Generated Image</h3>
                {backgroundType === 'ai' && (
                    <button
                        onClick={onRegenerateImage}
                        disabled={isRegeneratingImage || isCombining}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRegeneratingImage ? (
                            <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div>
                        ) : (
                            <MagicWandIcon className="w-4 h-4" />
                        )}
                        <span>{isRegeneratingImage ? 'Generating...' : 'Regenerate'}</span>
                    </button>
                )}
            </div>
            <div className="relative w-full">
                <img 
                    src={finalImage} 
                    alt="Generated Post" 
                    className={`rounded-lg shadow-lg w-full h-auto object-cover transition-opacity duration-300 ${isCombining || isRegeneratingImage ? 'opacity-50' : 'opacity-100'}`} 
                />
                {(isCombining || isRegeneratingImage) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-white"></div>
                    </div>
                )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">Logo Position</h3>
              <div className="grid grid-cols-3 gap-2 w-24 mx-auto">
                {logoPositions.map((pos, i) => (
                  pos ? (
                    <button
                      key={pos}
                      onClick={() => setLogoPosition(pos)}
                      className={`h-8 w-8 rounded-md flex items-center justify-center transition-colors ${
                        logoPosition === pos
                          ? 'bg-indigo-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label={`Set logo position to ${pos.replace('-', ' ')}`}
                    >
                      <div className={`h-2 w-2 rounded-full ${logoPosition === pos ? 'bg-white' : 'bg-gray-500'}`}></div>
                    </button>
                  ) : (
                    <div key={i} />
                  )
                ))}
              </div>
            </div>
            <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition"
            >
                <DownloadIcon className="w-5 h-5" />
                Download Image
            </button>
        </div>

        {/* Right side: Text content */}
        <div className="space-y-6">
           <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Font Style</h3>
            <div className="flex flex-wrap gap-2">
              {(['sans-serif', 'serif', 'monospace', 'jameel-noori', 'mb-sindhi'] as FontStyle[]).map((font) => (
                <button
                  key={font}
                  onClick={() => setSelectedFont(font)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedFont === font
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={fontStyles[font]}
                >
                  {fontDisplayNames[font]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Catchy Headlines</h3>
            <p className="text-sm text-gray-400 mb-3">Select a headline to use on the image and edit the text directly.</p>
             {rewriteError && <p className="text-red-400 text-sm mb-2">{rewriteError}</p>}
            <div className="space-y-3">
                <HeadlineEditor
                    id="h1"
                    value={headline1}
                    onChange={setHeadline1}
                    onRewrite={() => handleRewrite('h1')}
                    onSelect={() => setSelectedHeadline('h1')}
                    isSelected={selectedHeadline === 'h1'}
                    isRewriting={rewriting === 'h1'}
                    fontStyle={fontStyles[selectedFont]}
                />
                <HeadlineEditor
                    id="h2"
                    value={headline2}
                    onChange={setHeadline2}
                    onRewrite={() => handleRewrite('h2')}
                    onSelect={() => setSelectedHeadline('h2')}
                    isSelected={selectedHeadline === 'h2'}
                    isRewriting={rewriting === 'h2'}
                    fontStyle={fontStyles[selectedFont]}
                />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">About Summary</h3>
             <CopyableField text={about} style={fontStyles[selectedFont]} />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-6 text-center">
        <button
          onClick={onStartOver}
          className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition"
        >
          <RedoIcon className="w-5 h-5" />
          Create Another Post
        </button>
      </div>
    </div>
  );
};
