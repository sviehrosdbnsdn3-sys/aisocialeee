
export type AppStep = 'input' | 'text-loading' | 'text-generated' | 'image-loading' | 'review' | 'error';
export type FontStyle = 'sans-serif' | 'serif' | 'monospace' | 'jameel-noori' | 'mb-sindhi';
export type LogoPosition = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
export type DesignTemplate = 'classic' | 'top-bar' | 'heavy-bottom' | 'split-vertical' | 'minimal' | 'framed' | 'quote-focus' | 'news-banner';
export type BackgroundChoice = { type: 'ai', prompt: string } | { type: 'upload', file: File } | { type: 'library', url: string };

export interface GeneratedTextContent {
  headline1: string;
  headline2: string;
  about: string;
  imagePrompt: string;
  hashtags: string;
}

export type SocialPlatform = 'x' | 'instagram' | 'facebook' | 'linkedin' | 'website';

export interface SocialHandle {
  id: string;
  platform: SocialPlatform;
  username: string;
}

export interface BrandKit {
  name: string;
  logo: string; // Base64 Data URL
  brandColor: string;
  font: FontStyle;
  template: DesignTemplate;
  socialHandles?: SocialHandle[];
}

export const getTemplateDefaults = (template: DesignTemplate) => {
    switch (template) {
      case 'classic':
        return { logoPosition: 'bottom-right' as LogoPosition, fontSizeMultiplier: 1.0, textColor: '#FFFFFF', textShadow: true };
      case 'top-bar':
        return { logoPosition: 'top-left' as LogoPosition, fontSizeMultiplier: 1.1, textColor: '#FFFFFF', textShadow: false };
      case 'heavy-bottom':
        return { logoPosition: 'top-left' as LogoPosition, fontSizeMultiplier: 1.2, textColor: '#FFFFFF', textShadow: false };
      case 'split-vertical':
        return { logoPosition: 'top-left' as LogoPosition, fontSizeMultiplier: 1.0, textColor: '#FFFFFF', textShadow: false };
      case 'minimal':
        return { logoPosition: 'top-left' as LogoPosition, fontSizeMultiplier: 1.0, textColor: '#FFFFFF', textShadow: false };
      case 'framed':
        return { logoPosition: 'center' as LogoPosition, fontSizeMultiplier: 0.9, textColor: '#FFFFFF', textShadow: false };
      case 'quote-focus':
        return { logoPosition: 'center' as LogoPosition, fontSizeMultiplier: 1.3, textColor: '#FFFFFF', textShadow: true };
      case 'news-banner':
        return { logoPosition: 'top-left' as LogoPosition, fontSizeMultiplier: 1.0, textColor: '#FFFFFF', textShadow: false };
      default:
        return { logoPosition: 'bottom-right' as LogoPosition, fontSizeMultiplier: 1.0, textColor: '#FFFFFF', textShadow: true };
    }
};
