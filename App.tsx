
import React, { useState, useCallback, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { ReviewPanel } from './components/ReviewPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BrandKitManager } from './components/BrandKitManager';
import { generateTextAndImagePrompt, generateImage } from './services/geminiService';
import type { GeneratedTextContent, BrandKit, BackgroundChoice, LogoPosition, DesignTemplate, FontStyle, SocialHandle, SocialPlatform, AppStep, AspectRatio } from './types';
import { getTemplateDefaults, isRtl } from './types';
import { SparklesIcon, quoteIconPath } from './components/icons';


const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface ReviewState {
    brandColor: string;
    font: FontStyle;
    template: DesignTemplate;
    socialHandles: SocialHandle[];
}

// ... (other imports)

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('input');
  const [reviewData, setReviewData] = useState<{
      content: GeneratedTextContent,
      finalImage: string,
      baseImageSrc: string,
      logoFile: File | null,
      backgroundType: BackgroundChoice['type']
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [socialHandles, setSocialHandles] = useState<SocialHandle[]>([]);
  
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [isBrandKitManagerOpen, setIsBrandKitManagerOpen] = useState(false);
  const [initialReviewState, setInitialReviewState] = useState<ReviewState | null>(null);
  const [selectedKitName, setSelectedKitName] = useState<string>('');
  
  useEffect(() => {
    try {
      const savedKits = localStorage.getItem('brandKits');
      if (savedKits) {
        setBrandKits(JSON.parse(savedKits));
      }
    } catch (error) {
      console.error("Could not load brand kits from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('brandKits', JSON.stringify(brandKits));
    } catch (error) {
      console.error("Could not save brand kits to localStorage", error);
    }
  }, [brandKits]);

  const handleSaveBrandKit = async (kitData: { name: string; logoFile: File; brandColor: string; font: FontStyle; template: DesignTemplate; socialHandles: SocialHandle[]; }) => {
    const logoBase64 = await fileToBase64(kitData.logoFile);
    const newKit: BrandKit = {
        name: kitData.name,
        logo: logoBase64,
        brandColor: kitData.brandColor,
        font: kitData.font,
        template: kitData.template,
        socialHandles: kitData.socialHandles,
    };
    setBrandKits(prevKits => {
        const existingKitIndex = prevKits.findIndex(k => k.name === newKit.name);
        if (existingKitIndex > -1) {
            const updatedKits = [...prevKits];
            updatedKits[existingKitIndex] = newKit;
            return updatedKits;
        }
        return [...prevKits, newKit];
    });
  };
  
  const handleDeleteBrandKit = (kitName: string) => {
    setBrandKits(prevKits => prevKits.filter(k => k.name !== kitName));
  };

  const handleSelectBrandKit = (kit: BrandKit) => {
    setSelectedKitName(kit.name);
    setIsBrandKitManagerOpen(false);
  };


  const combineImages = useCallback(async (baseImageSrc: string, logoFile: File | null, headline: string, logoPosition: LogoPosition, fontFamily: string, template: DesignTemplate, brandColor: string, fontSizeMultiplier: number, textColor: string, textShadow: boolean, socialHandles: SocialHandle[], aspectRatio: AspectRatio): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Could not get canvas context'));

      const baseImage = new Image();
      baseImage.crossOrigin = 'anonymous';
      
      const performDrawing = (logoImage: HTMLImageElement | null) => {
        let targetWidth = 1080;
        let targetHeight = 1080;

        if (aspectRatio === '4:5') {
            targetWidth = 1080;
            targetHeight = 1350;
        } else if (aspectRatio === '16:9') {
            targetWidth = 1920;
            targetHeight = 1080;
        }

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        const padding = canvas.width * 0.05;
        // As per design rules, ensure text is at least 80px away from elements below it.
        const safeAreaPadding = 80; 

        const drawHeadline = (text: string, boxX: number, boxY: number, boxWidth: number, boxHeight: number, vAlign: 'top' | 'center' | 'bottom' = 'bottom', hAlign: 'left' | 'center' = 'left') => {
            const baseFontSize = Math.max(24, Math.round(canvas.width / 22));
            let fontSize = baseFontSize * fontSizeMultiplier;

            let lines: string[];
            let lineHeight: number;
            let textBlockHeight: number;

            // This loop makes the font size "responsive" to the container height.
            // It reduces the font size until the text block fits within the boxHeight.
            do {
                ctx.font = `700 ${fontSize}px ${fontFamily}`;
                
                const words = text.toUpperCase().split(' ');
                let line = '';
                lines = []; // Reset lines for recalculation
                lineHeight = fontSize * 1.15;

                for (const word of words) {
                    const testLine = line + word + ' ';
                    if (ctx.measureText(testLine).width > boxWidth && line.length > 0) {
                        lines.push(line.trim());
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line.trim());
                
                textBlockHeight = (lines.length) * lineHeight - (lineHeight - fontSize * 1.05);

                if (textBlockHeight > boxHeight) {
                    fontSize -= 2; // Reduce font size and try again
                }

            } while (textBlockHeight > boxHeight && fontSize > 18); // Don't let font get too small
            
            let startY;
            
            if (vAlign === 'bottom') {
                startY = boxY + boxHeight - ((lines.length -1) * lineHeight) - (lineHeight - fontSize);
            } else if (vAlign === 'center') {
                startY = boxY + (boxHeight - textBlockHeight) / 2 + fontSize * 0.9;
            } else { // top
                startY = boxY + fontSize;
            }
            
            const textIsRtl = isRtl(text);
            ctx.direction = textIsRtl ? 'rtl' : 'ltr';
            
            if (hAlign === 'center') {
              ctx.textAlign = 'center';
            } else {
              ctx.textAlign = textIsRtl ? 'right' : 'left';
            }

            ctx.textBaseline = 'top';
            ctx.fillStyle = textColor;
            
            ctx.save();
            if (textShadow) {
              ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
              ctx.shadowBlur = 8;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 4;
            }

            lines.forEach((l, i) => {
                let startX;
                if (hAlign === 'center') {
                  startX = boxX + boxWidth / 2;
                } else {
                  startX = textIsRtl ? boxX + boxWidth : boxX;
                }
                ctx.fillText(l, startX, startY + (i * lineHeight));
            });
            
            ctx.restore();
        };

        const drawLogo = (pos: LogoPosition, bounds = {x: 0, y: 0, width: canvas.width, height: canvas.height}) => {
           if (!logoImage) return;
           const logoWidth = canvas.width * 0.20;
           const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
           let logoX: number, logoY: number;

           switch (pos) {
               case 'top-left':
                   logoX = bounds.x + padding;
                   logoY = bounds.y + padding;
                   break;
               case 'top-right':
                   logoX = bounds.x + bounds.width - logoWidth - padding;
                   logoY = bounds.y + padding;
                   break;
               case 'center':
                   logoX = bounds.x + (bounds.width - logoWidth) / 2;
                   logoY = bounds.y + (bounds.height - logoHeight) / 2;
                   break;
               case 'bottom-left':
                   logoX = bounds.x + padding;
                   logoY = bounds.y + bounds.height - logoHeight - padding;
                   break;
               case 'bottom-right':
               default:
                   logoX = bounds.x + bounds.width - logoWidth - padding;
                   logoY = bounds.y + bounds.height - logoHeight - padding;
                   break;
           }
           ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
        };

        const socialIconData: Record<SocialPlatform, { path: string; viewBox: number }> = {
            facebook: { path: 'M22.675 0h-21.35c-0.732 0-1.325 0.593-1.325 1.325v21.351c0 0.731 0.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12v9.293h6.081c0.73 0 1.325-5.93 1.325-1.325v-21.35c0-0.732-0.593-1.325-1.325-1.325z', viewBox: 24 },
            instagram: { path: 'M12 2.163c3.204 0 3.584 0.012 4.85 0.07 3.252 0.148 4.771 1.691 4.919 4.919 0.058 1.265 0.07 1.646 0.07 4.85s-0.012 3.584-0.07 4.85c-0.148 3.227-1.669 4.771-4.919 4.919-1.266 0.058-1.646 0.07-4.85 0.07s-3.584-0.012-4.85-0.07c-3.252-0.148-4.771-1.691-4.919-4.919-0.058-1.265-0.07-1.646-0.07-4.85s0.012-3.584 0.07-4.85c0.148-3.227 1.669 4.771 4.919 4.919 1.266-0.058 1.646-0.07 4.85-0.07zm0-2.163c-3.264 0-3.664 0.012-4.943 0.07-4.322 0.198-6.131 2.008-6.329 6.329-0.058 1.279-0.07 1.679-0.07 4.943s0.012 3.664 0.07 4.943c0.198 4.322 2.008 6.131 6.329 6.329 1.279 0.058 1.679 0.07 4.943 0.07s3.664-0.012 4.943-0.07c4.322-0.198 6.131-2.008 6.329-6.329 0.058 1.279 0.07-1.679 0.07-4.943s-0.012-3.664-0.07-4.943c-0.198-4.322-2.008-6.131-6.329-6.329-1.279-0.058-1.679-0.07-4.943-0.07zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm4.802-11.884c-0.796 0-1.441 0.645-1.441 1.441s0.645 1.441 1.441 1.441 1.441-0.645 1.441-1.441-0.645-1.441-1.441-1.441z', viewBox: 24 },
            x: { path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153zm-1.61 19.713h2.54l-14.976-17.14H4.38l12.911 17.14z', viewBox: 24 },
            linkedin: { path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', viewBox: 24 },
            website: { path: 'M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.866 2.05C15.0123 2.50233 16.9038 3.79155 18.228 5.59602C19.5521 7.40049 20.218 9.64531 20.0945 11.9114C19.9711 14.1775 19.0689 16.3114 17.5587 17.9157C16.0485 19.5199 13.045 20.5 10.134 20.05C7.22298 19.6 5.13398 17.8005 3.77202 15.404C2.41006 12.9995 1.90553 10.1547 2.40902 7.40049C2.91251 4.64627 4.54053 2.50233 7.13402 2.05C8.86602 1.8 11.134 1.8 12.866 2.05ZM13 12C13 15.3137 10.3137 18 7 18C7 16.5168 7.37622 15.0934 8.05202 13.8458C8.72782 12.5982 9.67056 11.5714 10.7574 10.866C11.8442 10.1606 13 9.31371 13 8C13 6.68629 11.8442 5.8394 10.7574 5.13398C9.67056 4.42857 8.72782 3.40181 8.05202 2.15418C7.37622 0.906553 7 0 7 0C10.3137 0 13 2.68629 13 6V12Z', viewBox: 24 }
        };

        const drawSocialHandles = (ctx: CanvasRenderingContext2D, handles: SocialHandle[], y: number, area: {x: number, width: number} = {x: 0, width: ctx.canvas.width}) => {
            if (!handles || handles.length === 0) return;

            const iconSize = canvas.width * (24 / 1080);
            const textFontSize = canvas.width * (20 / 1080);
            const iconTextPadding = canvas.width * (10 / 1080);
            const handlePadding = canvas.width * (30 / 1080);

            ctx.font = `500 ${textFontSize}px ${fontFamily}`;
            ctx.fillStyle = 'white';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left';

            const measurements = handles.map(handle => {
                if (!handle.username.trim()) return 0;
                const textWidth = ctx.measureText(handle.username).width;
                return iconSize + iconTextPadding + textWidth;
            });

            const validHandles = handles.filter(h => h.username.trim());
            if (validHandles.length === 0) return;

            const totalWidth = measurements.reduce((sum, width) => sum + width, 0) + (handlePadding * (validHandles.length - 1));
            let currentX = area.x + (area.width - totalWidth) / 2;

            for (let i = 0; i < handles.length; i++) {
                const handle = handles[i];
                const icon = socialIconData[handle.platform];
                if (!icon || !handle.username.trim()) continue;

                // Draw icon
                const path = new Path2D(icon.path);
                const scale = iconSize / icon.viewBox;
                ctx.save();
                ctx.translate(currentX, y);
                ctx.scale(scale, scale);
                ctx.translate(0, -icon.viewBox / 2); // vertically center icon
                ctx.fill(path);
                ctx.restore();

                currentX += iconSize + iconTextPadding;

                // Draw text
                ctx.fillText(handle.username, currentX, y);

                currentX += measurements[i] - iconSize - iconTextPadding + handlePadding;
            }
        };

        // --- Template specific drawing functions ---
        const drawRtNewsTemplate = () => {
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            if (logoImage) {
                const logoMaxWidth = canvas.width * 0.25;
                const logoMaxHeight = canvas.height * 0.1;

                let logoWidth = logoImage.width;
                let logoHeight = logoImage.height;
                const logoAspectRatio = logoWidth / logoHeight;
                
                if (logoWidth > logoMaxWidth) {
                    logoWidth = logoMaxWidth;
                    logoHeight = logoWidth / logoAspectRatio;
                }
                if (logoHeight > logoMaxHeight) {
                    logoHeight = logoMaxHeight;
                    logoWidth = logoHeight * logoAspectRatio;
                }
                
                // Draw logo without background
                ctx.drawImage(logoImage, padding, padding, logoWidth, logoHeight);
            }

            const socialBarHeight = canvas.height * 0.08;
            const mainBannerHeight = canvas.height * 0.20;
            const bottomSectionHeight = socialBarHeight + mainBannerHeight;
            const mainBannerY = canvas.height - bottomSectionHeight;
            const socialBarY = canvas.height - socialBarHeight;
            
            const r = 20;
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(0, socialBarY);
            ctx.lineTo(0, mainBannerY + r);
            ctx.quadraticCurveTo(0, mainBannerY, r, mainBannerY);
            ctx.lineTo(canvas.width - r, mainBannerY);
            ctx.quadraticCurveTo(canvas.width, mainBannerY, canvas.width, mainBannerY + r);
            ctx.lineTo(canvas.width, socialBarY);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'black';
            ctx.fillRect(0, socialBarY, canvas.width, socialBarHeight);

            ctx.fillStyle = brandColor;
            ctx.beginPath();
            ctx.moveTo(0, socialBarY);
            ctx.lineTo(canvas.width * 0.2, socialBarY);
            ctx.lineTo(canvas.width * 0.15, socialBarY + socialBarHeight);
            ctx.lineTo(0, socialBarY + socialBarHeight);
            ctx.closePath();
            ctx.fill();

            const socialArea = { x: canvas.width * 0.2, width: canvas.width * 0.8 };
            drawSocialHandles(ctx, socialHandles, socialBarY + socialBarHeight / 2, socialArea);

            const headlineBox = { x: padding, y: mainBannerY, width: canvas.width - padding * 2, height: mainBannerHeight };
            const baseFontSize = Math.max(24, Math.round(canvas.width / 20));
            let fontSize = baseFontSize * fontSizeMultiplier;
            let lines: string[];
            let lineHeight: number;
            let textBlockHeight: number;
            do {
                ctx.font = `900 ${fontSize}px ${fontFamily}`;
                lineHeight = fontSize * 1.15;
                const words = headline.toUpperCase().split(' ');
                let line = '';
                lines = [];
                for (const word of words) {
                    const testLine = line + word + ' ';
                    if (ctx.measureText(testLine).width > headlineBox.width && line.length > 0) {
                        lines.push(line.trim());
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line.trim());
                textBlockHeight = (lines.length * lineHeight) - (lineHeight - fontSize * 1.05);
                if (textBlockHeight > headlineBox.height) {
                    fontSize -= 2;
                }
            } while (textBlockHeight > headlineBox.height && fontSize > 20);
            
            const startY = headlineBox.y + (headlineBox.height - textBlockHeight) / 2 + fontSize * 0.9;
            ctx.textBaseline = 'top';
            ctx.font = `900 ${fontSize}px ${fontFamily}`;
            
            const textIsRtl = isRtl(headline);
            ctx.direction = textIsRtl ? 'rtl' : 'ltr';
            ctx.textAlign = textIsRtl ? 'right' : 'left';

            const accentWordCount = 2;
            let wordCounter = 0;
            lines.forEach((line, i) => {
                const lineY = startY + (i * lineHeight);
                let currentX = textIsRtl ? headlineBox.x + headlineBox.width : headlineBox.x;
                const wordsInLine = line.split(' ');

                wordsInLine.forEach(word => {
                    if (word.trim() === '') return;
                    
                    ctx.fillStyle = wordCounter < accentWordCount ? brandColor : 'black';
                    
                    if (textIsRtl) {
                        ctx.fillText(word, currentX, lineY);
                        currentX -= ctx.measureText(word + ' ').width;
                    } else {
                        ctx.fillText(word, currentX, lineY);
                        currentX += ctx.measureText(word + ' ').width;
                    }
                    wordCounter++;
                });
            });
        };

        const drawTopBarTemplate = () => {
            ctx.fillStyle = '#111827';
            ctx.fillRect(0,0,canvas.width, canvas.height);

            ctx.fillStyle = brandColor;
            const topBarHeight = canvas.height * 0.15;
            ctx.fillRect(0, 0, canvas.width, topBarHeight);
            
            if (logoImage) {
              const logoWidth = topBarHeight * 0.6 * (logoImage.width / logoImage.height);
              const logoHeight = topBarHeight * 0.6;
              ctx.drawImage(logoImage, padding, (topBarHeight - logoHeight) / 2, logoWidth, logoHeight);
            }

            const imgDestY = topBarHeight;
            const imgDestHeight = canvas.height * 0.55;
            const sourceAspectRatio = baseImage.width / baseImage.height;
            const destAspectRatio = canvas.width / imgDestHeight;
            let sx, sy, sWidth, sHeight;
            if (sourceAspectRatio > destAspectRatio) {
                sHeight = baseImage.height;
                sWidth = sHeight * destAspectRatio;
                sx = (baseImage.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = baseImage.width;
                sHeight = sWidth / destAspectRatio;
                sx = 0;
                sy = (baseImage.height - sHeight) / 2;
            }
            ctx.drawImage(baseImage, sx, sy, sWidth, sHeight, 0, imgDestY, canvas.width, imgDestHeight);
            
            const bottomBarY = topBarHeight + imgDestHeight;
            const bottomBarHeight = canvas.height - bottomBarY;
            ctx.fillStyle = brandColor;
            ctx.fillRect(0, bottomBarY, canvas.width, bottomBarHeight);

            drawHeadline(headline, padding, bottomBarY + padding/2, canvas.width - padding*2, bottomBarHeight - padding, 'center');
        };

        const drawQuoteFocusTemplate = () => {
            ctx.filter = 'blur(10px)';
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            ctx.filter = 'none';

            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const quotePath = new Path2D(quoteIconPath);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            const quoteSize = 300;
            const scale = quoteSize / 24;
            ctx.save();
            ctx.translate((canvas.width - quoteSize)/2, (canvas.height - quoteSize)/2 - 50);
            ctx.scale(scale, scale);
            ctx.fill(quotePath);
            ctx.restore();

            const socialBarHeight = canvas.height * 0.075;
            const socialBarY = canvas.height - socialBarHeight;
            const headlineBoxY = padding;
            const headlineBoxHeight = socialBarY - headlineBoxY - safeAreaPadding;

            drawHeadline(headline, padding, headlineBoxY, canvas.width - padding*2, headlineBoxHeight, 'center', 'center');
            
            drawSocialHandles(ctx, socialHandles, canvas.height - (socialBarHeight / 2));
        };

        const drawNewsBannerTemplate = () => {
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

            const bannerHeight = canvas.height * 0.22;
            const bannerY = canvas.height - bannerHeight;
            ctx.fillStyle = brandColor;
            ctx.fillRect(0, bannerY, canvas.width, bannerHeight);

            if (logoImage) {
                const logoHeight = bannerHeight * 0.4;
                const logoWidth = logoHeight * (logoImage.width / logoImage.height);
                const logoX = padding;
                const logoY = bannerY + (bannerHeight - logoHeight) / 2;
                ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
                
                const dividerX = logoX + logoWidth + padding;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fillRect(dividerX, bannerY + padding, 3, bannerHeight - padding*2);
                
                const textX = dividerX + padding;
                const textWidth = canvas.width - textX - padding;
                drawHeadline(headline, textX, bannerY, textWidth, bannerHeight, 'center');
            } else {
                drawHeadline(headline, padding, bannerY, canvas.width - padding*2, bannerHeight, 'center');
            }
        };

        const drawHeavyBottomTemplate = () => {
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            drawLogo(logoPosition);

            const socialBarHeight = canvas.height * 0.075;
            const barHeight = canvas.height * 0.45;
            const textBarHeight = barHeight - socialBarHeight;
            const textBarY = canvas.height - barHeight;

            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.fillRect(0, textBarY, canvas.width, textBarHeight);
            
            const headlineBoxHeight = textBarHeight - padding - safeAreaPadding;
            drawHeadline(headline, padding, textBarY + padding, canvas.width - padding*2, headlineBoxHeight, 'center');

            ctx.fillStyle = 'black';
            ctx.fillRect(0, canvas.height - socialBarHeight, canvas.width, socialBarHeight);
            drawSocialHandles(ctx, socialHandles, canvas.height - (socialBarHeight / 2));
        };

        const drawSplitVerticalTemplate = () => {
            const splitPoint = canvas.width / 2;
            
            const sourceAspectRatio = baseImage.width / baseImage.height;
            const destAspectRatio = splitPoint / canvas.height;
            let sx, sy, sWidth, sHeight;

            if (sourceAspectRatio > destAspectRatio) {
                sHeight = baseImage.height;
                sWidth = sHeight * destAspectRatio;
                sx = (baseImage.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = baseImage.width;
                sHeight = sWidth / destAspectRatio;
                sx = 0;
                sy = (baseImage.height - sHeight) / 2;
            }
            ctx.drawImage(baseImage, sx, sy, sWidth, sHeight, 0, 0, splitPoint, canvas.height);

            ctx.fillStyle = brandColor;
            ctx.fillRect(splitPoint, 0, splitPoint, canvas.height);
            
            const rightPadding = padding * 1.5;
            let textY = padding * 2;

            if (logoImage) {
                const logoMaxWidth = splitPoint - rightPadding * 2;
                const logoAspectRatio = logoImage.width / logoImage.height;
                let logoWidth = Math.min(logoImage.width, logoMaxWidth);
                let logoHeight = logoWidth / logoAspectRatio;

                if (logoHeight > canvas.height * 0.2) {
                    logoHeight = canvas.height * 0.2;
                    logoWidth = logoHeight * logoAspectRatio;
                }

                const logoX = splitPoint + (splitPoint - logoWidth) / 2;
                const logoY = padding * 2;
                ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
                textY = logoY + logoHeight + padding;
            }

            const socialBarHeight = canvas.height * 0.075;
            const textHeight = canvas.height - textY - socialBarHeight - padding;
            drawHeadline(headline, splitPoint + rightPadding, textY, splitPoint - rightPadding * 2, textHeight, 'center');
            
            drawSocialHandles(ctx, socialHandles, canvas.height - (socialBarHeight / 2), { x: splitPoint, width: splitPoint });
        };

        const drawMinimalTemplate = () => {
            ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
            
            const socialBarHeight = canvas.height * 0.055;
            const textOverlayHeight = canvas.height * 0.3;
            const textOverlayY = canvas.height - textOverlayHeight - socialBarHeight;
            
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, textOverlayY, canvas.width, textOverlayHeight);
            
            const headlineBoxHeight = textOverlayHeight - padding * 2 - safeAreaPadding;
            drawHeadline(headline, padding, textOverlayY + padding, canvas.width - padding*2, headlineBoxHeight, 'center');
            
            ctx.fillStyle = brandColor;
            ctx.fillRect(0, canvas.height - socialBarHeight, canvas.width, socialBarHeight);
            drawSocialHandles(ctx, socialHandles, canvas.height - (socialBarHeight / 2));
            
            drawLogo(logoPosition, {x: 0, y: 0, width: canvas.width, height: textOverlayY });
        };

        const drawFramedTemplate = () => {
            const borderSize = canvas.width * 0.08;
            
            ctx.fillStyle = brandColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const innerX = borderSize;
            const innerY = borderSize;
            const innerWidth = canvas.width - borderSize * 2;
            const innerHeight = canvas.height - borderSize * 2;

            const sourceAspectRatio = baseImage.width / baseImage.height;
            const destAspectRatio = innerWidth / innerHeight;
            let sx, sy, sWidth, sHeight;
            if (sourceAspectRatio > destAspectRatio) {
                sHeight = baseImage.height;
                sWidth = sHeight * destAspectRatio;
                sx = (baseImage.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = baseImage.width;
                sHeight = sWidth / destAspectRatio;
                sx = 0;
                sy = (baseImage.height - sHeight) / 2;
            }
            ctx.drawImage(baseImage, sx, sy, sWidth, sHeight, innerX, innerY, innerWidth, innerHeight);
            
            if (logoImage) {
                const logoMaxHeight = borderSize * 0.6;
                const logoAspectRatio = logoImage.width / logoImage.height;
                let logoHeight = Math.min(logoImage.height, logoMaxHeight);
                let logoWidth = logoHeight * logoAspectRatio;
                const logoX = (canvas.width - logoWidth) / 2;
                const logoY = (borderSize - logoHeight) / 2;
                ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
            }

            const bannerHeight = innerHeight * 0.35;
            const bannerY = innerY + innerHeight - bannerHeight;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(innerX, bannerY, innerWidth, bannerHeight);
            
            drawHeadline(headline, innerX + padding, bannerY + padding / 2, innerWidth - padding * 2, bannerHeight - padding, 'center', 'center');
            drawSocialHandles(ctx, socialHandles, canvas.height - (borderSize / 2));
        };
        
        const drawClassicTemplate = () => {
            const socialBarHeight = canvas.height * 0.075;
            
            const sourceAspectRatio = baseImage.width / baseImage.height;
            const destAspectRatio = canvas.width / canvas.height;
            let sx, sy, sWidth, sHeight;
            if (sourceAspectRatio > destAspectRatio) {
                sHeight = baseImage.height;
                sWidth = sHeight * destAspectRatio;
                sx = (baseImage.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = baseImage.width;
                sHeight = sWidth / destAspectRatio;
                sx = 0;
                sy = (baseImage.height - sHeight) / 2;
            }
            ctx.drawImage(baseImage, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

            const gradientHeight = canvas.height * 0.5;
            const socialBarY = canvas.height - socialBarHeight;
            const gradientY = canvas.height - gradientHeight;
            
            const gradient = ctx.createLinearGradient(0, gradientY, 0, socialBarY);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(0.2, 'rgba(0,0,0,0.4)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.85)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, gradientY, canvas.width, socialBarY - gradientY);
            
            const headlineBoxY = gradientY;
            const headlineBoxHeight = socialBarY - headlineBoxY - safeAreaPadding;
            drawHeadline(headline, padding, headlineBoxY, canvas.width - padding * 2, headlineBoxHeight, 'bottom');
            
            drawLogo(logoPosition, {x: 0, y: 0, width: canvas.width, height: socialBarY });

            ctx.fillStyle = 'black';
            ctx.fillRect(0, socialBarY, canvas.width, socialBarHeight);
            drawSocialHandles(ctx, socialHandles, canvas.height - (socialBarHeight / 2));
        };
        
        switch (template) {
          case 'rt-news':
            drawRtNewsTemplate();
            break;
          case 'top-bar':
            drawTopBarTemplate();
            break;
          case 'quote-focus':
            drawQuoteFocusTemplate();
            break;
          case 'news-banner':
            drawNewsBannerTemplate();
            break;
          case 'heavy-bottom':
            drawHeavyBottomTemplate();
            break;
          case 'split-vertical':
            drawSplitVerticalTemplate();
            break;
          case 'minimal':
            drawMinimalTemplate();
            break;
          case 'framed':
            drawFramedTemplate();
            break;
          case 'classic':
          default:
            drawClassicTemplate();
            break;
        }
        
        resolve(canvas.toDataURL('image/png'));
      };

      baseImage.onload = () => {
        if (logoFile) {
          const logoImage = new Image();
          logoImage.onload = () => performDrawing(logoImage);
          logoImage.onerror = (err) => reject(new Error('Failed to load logo image: ' + err));
          logoImage.src = URL.createObjectURL(logoFile);
        } else {
          performDrawing(null);
        }
      };
      baseImage.onerror = (err) => reject(new Error('Failed to load generated image: ' + err));
      baseImage.src = baseImageSrc;
    });
  }, []);

  const handleGeneratePost = async (
    content: string,
    tone: string,
    audience: string,
    imageStyle: string,
    logo: File | null,
    background: BackgroundChoice,
    socialHandles: SocialHandle[],
    template: DesignTemplate,
    brandColor: string,
    font: FontStyle
  ) => {
    setStep('text-loading');
    setErrorMessage('');
    setOriginalContent(content);
    try {
        const generatedText = await generateTextAndImagePrompt(content, tone, audience, imageStyle);

        setStep('image-loading');
        setLogoFile(logo);
        setSocialHandles(socialHandles);

        const reviewState: ReviewState = {
            brandColor,
            font,
            template,
            socialHandles,
        };
        setInitialReviewState(reviewState);

        let baseImageSrc = '';
        
        const backgroundForImageGen: BackgroundChoice = background.type === 'ai'
            ? { type: 'ai', prompt: generatedText.imagePrompt }
            : background;

        if (backgroundForImageGen.type === 'ai') {
            try {
                const generatedImgBase64 = await generateImage(backgroundForImageGen.prompt);
                baseImageSrc = `data:image/png;base64,${generatedImgBase64}`;
            } catch (e) {
                console.warn("Initial image generation failed, trying a fallback prompt.", e);
                const fallbackPrompt = `A professional, abstract background for a news story. Style: photorealistic, subtle, dark tones.`;
                const fallbackImgBase64 = await generateImage(fallbackPrompt);
                baseImageSrc = `data:image/png;base64,${fallbackImgBase64}`;
            }
        } else if (backgroundForImageGen.type === 'upload') {
            baseImageSrc = URL.createObjectURL(backgroundForImageGen.file);
        } else if (backgroundForImageGen.type === 'library') {
            baseImageSrc = backgroundForImageGen.url;
        }

        const { logoPosition, fontSizeMultiplier, textColor, textShadow } = getTemplateDefaults(template);
        
        const fontFamilies: Record<FontStyle, string> = {
            'sans-serif': "'Noto Sans', sans-serif",
            'serif': "'Noto Serif', serif",
            'monospace': "'Noto Sans Mono', monospace",
            'jameel-noori': "'Jameel Noori Nastaleeq', cursive",
            'mb-sindhi': "'MB Sindhi', sans-serif",
        };

        const compositeImage = await combineImages(
            baseImageSrc,
            logo,
            generatedText.headline1,
            logoPosition,
            fontFamilies[font],
            template,
            brandColor,
            fontSizeMultiplier,
            textColor,
            textShadow,
            socialHandles,
            '1:1' // Initial generation is always 1:1
        );

        setReviewData({
            content: generatedText,
            finalImage: compositeImage,
            baseImageSrc,
            logoFile: logo,
            backgroundType: backgroundForImageGen.type,
        });

        setStep('review');
    } catch (error) {
        handleError(error, "Failed to generate post.");
    }
  };
  
  const handleError = (error: unknown, contextMessage: string) => {
      console.error(error);
      let message = error instanceof Error ? error.message : 'An unknown error occurred.';
      if (message.includes("Image generation failed")) {
          message = "The AI couldn't create an image for this content, possibly due to safety filters. Please try modifying your input text or generating again."
      }
      setErrorMessage(`${contextMessage} ${message}`);
      setStep('error');
  };

  const handleRegenerateImage = useCallback(async (prompt: string) => {
    if (!reviewData) return;
    setIsRegeneratingImage(true);
    try {
      let newBaseImageSrc = '';
      try {
        const generatedImgBase64 = await generateImage(prompt);
        newBaseImageSrc = `data:image/png;base64,${generatedImgBase64}`;
      } catch (e) {
        console.warn("Image regeneration failed, trying a fallback prompt.", e);
        const fallbackPrompt = `A professional, abstract background for a news story. Style: photorealistic, subtle, dark tones.`;
        const fallbackImgBase64 = await generateImage(fallbackPrompt);
        newBaseImageSrc = `data:image/png;base64,${fallbackImgBase64}`;
      }
      setReviewData(prev => prev ? { ...prev, baseImageSrc: newBaseImageSrc, content: {...prev.content, imagePrompt: prompt} } : null);
    } catch (error) {
      console.error("Failed to regenerate image even with fallback", error);
    } finally {
      setIsRegeneratingImage(false);
    }
  }, [reviewData]);

  const handleStartOver = () => {
    setStep('input');
    setReviewData(null);
    setErrorMessage('');
    setOriginalContent('');
    setLogoFile(null);
    setSocialHandles([]);
    setInitialReviewState(null);
    setSelectedKitName('');
  };

  const renderContent = () => {
    switch (step) {
      case 'input':
        return <InputForm 
                    onGeneratePost={handleGeneratePost}
                    brandKits={brandKits} 
                    onOpenBrandKitManager={() => setIsBrandKitManagerOpen(true)}
                    selectedKitName={selectedKitName}
                    onSelectKitName={setSelectedKitName}
                />;
      case 'text-loading':
        return <LoadingSpinner stage="text" />;
      case 'image-loading':
        return <LoadingSpinner stage="image" />;
      case 'review':
        if (reviewData && initialReviewState) {
          return <ReviewPanel 
                    key={reviewData.baseImageSrc} // Force re-mount on image change
                    content={reviewData.content} 
                    initialFinalImage={reviewData.finalImage}
                    baseImageSrc={reviewData.baseImageSrc}
                    logoFile={reviewData.logoFile}
                    combineImages={combineImages}
                    onStartOver={handleStartOver} 
                    originalContent={originalContent}
                    backgroundType={reviewData.backgroundType}
                    onRegenerateImage={handleRegenerateImage}
                    isRegeneratingImage={isRegeneratingImage}
                    onSaveBrandKit={handleSaveBrandKit}
                    initialBrandColor={initialReviewState.brandColor}
                    initialFont={initialReviewState.font}
                    initialTemplate={initialReviewState.template}
                    initialSocialHandles={initialReviewState.socialHandles}
                    brandKits={brandKits}
                />;
        }
        handleError(new Error("Review data is missing"), "Could not prepare review panel.");
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
        <BrandKitManager
            isOpen={isBrandKitManagerOpen}
            onClose={() => setIsBrandKitManagerOpen(false)}
            kits={brandKits}
            onDelete={handleDeleteBrandKit}
            onSelect={handleSelectBrandKit}
        />
    </div>
  );
};

export default App;
