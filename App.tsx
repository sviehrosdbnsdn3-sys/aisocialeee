
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { ReviewPanel } from './components/ReviewPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateTextAndImagePrompt, generateImage } from './services/geminiService';
import type { GeneratedTextContent } from './types';
import { SparklesIcon } from './components/icons';

type AppStep = 'input' | 'loading' | 'review' | 'error';
export type BackgroundChoice = { type: 'ai' } | { type: 'upload', file: File } | { type: 'library', url: string };
export type LogoPosition = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';

const isRtl = (text: string) => {
    const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return rtlRegex.test(text);
};

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('input');
  const [generatedContent, setGeneratedContent] = useState<GeneratedTextContent | null>(null);
  const [initialFinalImage, setInitialFinalImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [baseImageSrc, setBaseImageSrc] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundType, setBackgroundType] = useState<BackgroundChoice['type'] | null>(null);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

  const combineImages = useCallback(async (baseImageSrc: string, logoFile: File, headline: string, logoPosition: LogoPosition, fontFamily: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Could not get canvas context'));

      const baseImage = new Image();
      baseImage.crossOrigin = 'anonymous';
      baseImage.onload = () => {
        const targetWidth = 1080;
        const targetHeight = 1080;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.drawImage(baseImage, 0, 0, targetWidth, targetHeight);

        // Add a dark gradient overlay at the bottom for text readability
        const gradientHeight = canvas.height * 0.5;
        const gradient = ctx.createLinearGradient(0, canvas.height - gradientHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.2, 'rgba(0,0,0,0.4)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - gradientHeight, canvas.width, gradientHeight);

        const logoImage = new Image();
        logoImage.onload = () => {
          const padding = canvas.width * 0.05;

          // --- Draw Headline Text ---
          const fontSize = Math.max(24, Math.round(canvas.width / 22));
          ctx.font = `700 ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = 'white';
          
          const textIsRtl = isRtl(headline);
          ctx.direction = textIsRtl ? 'rtl' : 'ltr';
          ctx.textAlign = textIsRtl ? 'right' : 'left';
          
          ctx.textBaseline = 'bottom';

          const textToDraw = headline.toUpperCase();
          const words = textToDraw.split(' ');
          let line = '';
          const lines = [];
          const maxWidth = canvas.width - (padding * 2);
          const lineHeight = fontSize * 1.15;

          for (const word of words) {
            const testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
              lines.push(line.trim());
              line = word + ' ';
            } else {
              line = testLine;
            }
          }
          lines.push(line.trim());
          
          const textBlockHeight = (lines.length -1) * lineHeight;
          const startY = canvas.height - padding - textBlockHeight;
          const startX = textIsRtl ? canvas.width - padding : padding;

          lines.forEach((l, i) => {
            ctx.fillText(l, startX, startY + (i * lineHeight));
          });
          
          // --- Draw Logo ---
          const logoWidth = canvas.width * 0.20;
          const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
          let logoX: number;
          let logoY: number;

          switch (logoPosition) {
            case 'top-left':
              logoX = padding;
              logoY = padding;
              break;
            case 'top-right':
              logoX = canvas.width - logoWidth - padding;
              logoY = padding;
              break;
            case 'center':
              logoX = (canvas.width - logoWidth) / 2;
              logoY = (canvas.height - logoHeight) / 2;
              break;
            case 'bottom-left':
              logoX = padding;
              logoY = canvas.height - logoHeight - padding;
              break;
            case 'bottom-right':
            default:
              logoX = canvas.width - logoWidth - padding;
              logoY = canvas.height - logoHeight - padding;
              break;
          }

          ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
          
          resolve(canvas.toDataURL('image/png'));
        };
        logoImage.onerror = (err) => reject(new Error('Failed to load logo image: ' + err));
        logoImage.src = URL.createObjectURL(logoFile);
      };
      baseImage.onerror = (err) => reject(new Error('Failed to load generated image: ' + err));
      baseImage.src = baseImageSrc;
    });
  }, []);

  const handleGenerate = async (
    content: string, 
    logo: File, 
    tone: string, 
    audience: string,
    background: BackgroundChoice,
    imageStyle: string
  ) => {
    setStep('loading');
    setErrorMessage('');
    setOriginalContent(content);
    setLogoFile(logo);
    setBackgroundType(background.type);

    try {
      const textData = await generateTextAndImagePrompt(content, tone, audience, imageStyle);
      
      let generatedBaseImageSrc = '';

      if (background.type === 'ai') {
        try {
            const generatedImgBase64 = await generateImage(textData.imagePrompt);
            generatedBaseImageSrc = `data:image/png;base64,${generatedImgBase64}`;
        } catch (e) {
            console.warn("Initial image generation failed, trying a fallback prompt.", e);
            const fallbackPrompt = `A professional, abstract background for a news story. Style: photorealistic, subtle, dark tones.`;
            try {
                const fallbackImgBase64 = await generateImage(fallbackPrompt);
                generatedBaseImageSrc = `data:image/png;base64,${fallbackImgBase64}`;
            } catch (fallbackError) {
                console.error("Fallback image generation also failed.", fallbackError);
                throw e;
            }
        }
      } else if (background.type === 'upload') {
        generatedBaseImageSrc = URL.createObjectURL(background.file);
      } else if (background.type === 'library') {
        generatedBaseImageSrc = background.url;
      }
      
      setBaseImageSrc(generatedBaseImageSrc);
      const compositeImage = await combineImages(generatedBaseImageSrc, logo, textData.headline1, 'bottom-right', "'Noto Sans', sans-serif");

      setGeneratedContent(textData);
      setInitialFinalImage(compositeImage);
      setStep('review');
    } catch (error) {
      console.error(error);
      let message = error instanceof Error ? error.message : 'An unknown error occurred.';
      if (message.includes("Image generation failed")) {
          message = "The AI couldn't create an image for this content, possibly due to safety filters. Please try modifying your input text or generating again."
      }
      setErrorMessage(`Failed to generate post. ${message}`);
      setStep('error');
    }
  };

  const handleRegenerateImage = useCallback(async () => {
    if (!generatedContent?.imagePrompt) return;
    setIsRegeneratingImage(true);
    try {
      let newBaseImageSrc = '';
      try {
        const generatedImgBase64 = await generateImage(generatedContent.imagePrompt);
        newBaseImageSrc = `data:image/png;base64,${generatedImgBase64}`;
      } catch (e) {
        console.warn("Image regeneration failed, trying a fallback prompt.", e);
        const fallbackPrompt = `A professional, abstract background for a news story. Style: photorealistic, subtle, dark tones.`;
        const fallbackImgBase64 = await generateImage(fallbackPrompt);
        newBaseImageSrc = `data:image/png;base64,${fallbackImgBase64}`;
      }
      setBaseImageSrc(newBaseImageSrc);
    } catch (error) {
      console.error("Failed to regenerate image even with fallback", error);
      // Optionally, set an error state to be displayed on the review panel
    } finally {
      setIsRegeneratingImage(false);
    }
  }, [generatedContent]);

  const handleStartOver = () => {
    setStep('input');
    setGeneratedContent(null);
    setInitialFinalImage(null);
    setErrorMessage('');
    setOriginalContent('');
    setBaseImageSrc(null);
    setLogoFile(null);
    setBackgroundType(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'input':
        return <InputForm onGenerate={handleGenerate} />;
      case 'loading':
        return <LoadingSpinner />;
      case 'review':
        if (generatedContent && initialFinalImage && baseImageSrc && logoFile && backgroundType) {
          return <ReviewPanel 
                    content={generatedContent} 
                    initialFinalImage={initialFinalImage}
                    baseImageSrc={baseImageSrc}
                    logoFile={logoFile}
                    combineImages={combineImages}
                    onStartOver={handleStartOver} 
                    originalContent={originalContent}
                    backgroundType={backgroundType}
                    onRegenerateImage={handleRegenerateImage}
                    isRegeneratingImage={isRegeneratingImage}
                />;
        }
        setErrorMessage('Generated content is missing. Please try again.');
        setStep('error');
        return null;
      case 'error':
        return (
          <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">{errorMessage}</p>
            <button
              onClick={handleStartOver}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
        <header className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-2">
                <SparklesIcon className="w-10 h-10 text-indigo-400" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">AI Social Post Creator</h1>
            </div>
            <p className="text-lg text-gray-400">Generate professional news posts with branded images in seconds.</p>
        </header>
        <main className="w-full max-w-4xl">
            {renderContent()}
        </main>
    </div>
  );
};

export default App;
