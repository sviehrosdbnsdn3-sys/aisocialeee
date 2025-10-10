
import React from 'react';
import type { LogoPosition, AspectRatio, DesignTemplate } from '../types';

type IconProps = React.HTMLAttributes<SVGElement>;

export const UploadIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const MagicWandIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5l-2.25-2.25-2.25 2.25-2.25-2.25-2.25 2.25L3 10.5m18 0l-2.25-2.25-2.25 2.25-2.25-2.25-2.25 2.25L12 10.5m0 0v-3m0 3v3m0 0l-2.25 2.25-2.25-2.25-2.25 2.25-2.25-2.25L3 15m18 0l-2.25 2.25-2.25-2.25-2.25 2.25-2.25-2.25L12 15m0 0v3m0 0v3" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const ClipboardIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6 4h.01M9 16h.01" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const RedoIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-4.991v4.99" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3.5a1.5 1.5 0 013 0V5a1.5 1.5 0 01-3 0V3.5zM10 15a1.5 1.5 0 013 0v1.5a1.5 1.5 0 01-3 0V15zM4.5 10a1.5 1.5 0 000 3h1.5a1.5 1.5 0 000-3H4.5zM15 10a1.5 1.5 0 000 3h1.5a1.5 1.5 0 000-3H15zM10 4.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM10 14.5a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM5.5 10a.5.5 0 000-1h-1a.5.5 0 000 1h1zM15.5 10a.5.5 0 000-1h-1a.5.5 0 000 1h1zM10 0a1 1 0 00-1 1v1.5a1 1 0 002 0V1a1 1 0 00-1-1zM10 17.5a1 1 0 00-1 1V20a1 1 0 002 0v-1.5a1 1 0 00-1-1zM2.5 9a1 1 0 00-1.5 1a1 1 0 001.5-1zM17.5 9a1 1 0 00-1.5 1a1 1 0 001.5-1zM1 2.5a1 1 0 001-1.5A1 1 0 001 2.5zM19 2.5a1 1 0 001-1.5A1 1 0 0019 2.5zM1.001 17.5a1 1 0 001.5 1a1 1 0 00-1.5-1zM19 17.5a1 1 0 001.5 1a1 1 0 00-1.5-1z" />
  </svg>
);

export const ClassicLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <path d="M4 23C13.3333 21.6667 22.6667 21.6667 32 23V28H4V23Z" fill="currentColor" fillOpacity="0.5"/>
        <rect x="7" y="24" width="18" height="2" rx="1" fill="currentColor"/>
        <rect x="23" y="7" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.8"/>
    </svg>
);

export const TopBarLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <path d="M4 0H28C30.2091 0 32 1.79086 32 4V8H0V4C0 1.79086 1.79086 0 4 0Z" fill="currentColor" fillOpacity="0.8"/>
        <rect x="4" y="20" width="32" height="12" transform="rotate(-180 4 20)" fill="currentColor" fillOpacity="0.8"/>
        <rect x="7" y="24" width="18" height="2" rx="1" fill="white"/>
        <rect x="5" y="3" width="6" height="2" rx="1" fill="white" fillOpacity="0.8"/>
    </svg>
);

export const HeavyBottomLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <rect y="18" width="32" height="14" fill="currentColor" fillOpacity="0.5"/>
        <rect x="7" y="22" width="18" height="2" rx="1" fill="currentColor"/>
        <rect x="7" y="26" width="14" height="2" rx="1" fill="currentColor"/>
        <rect x="5" y="5" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.8"/>
    </svg>
);

export const SplitVerticalLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <path d="M16 4H28C30.2091 4 32 5.79086 32 8V24C32 26.2091 30.2091 28 28 28H16V4Z" fill="currentColor" fillOpacity="0.8"/>
        <rect x="19" y="14" width="10" height="2" rx="1" fill="white"/>
        <rect x="19" y="18" width="8" height="2" rx="1" fill="white"/>
        <rect x="23" y="7" width="4" height="2" rx="1" fill="white" fillOpacity="0.8"/>
        <path d="M4 4H16V28H4V4Z" fill="currentColor" fillOpacity="0.4"/>
    </svg>
);

export const MinimalLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <rect y="20" width="32" height="8" fill="currentColor" fillOpacity="0.5"/>
        <rect x="6" y="22" width="20" height="2" rx="1" fill="currentColor"/>
        <rect y="28" width="32" height="4" fill="currentColor" fillOpacity="0.8"/>
        <rect x="5" y="5" width="4" height="4" rx="1" fill="currentColor" fillOpacity="0.8"/>
    </svg>
);


export const FramedLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.8"/>
        <rect x="4" y="4" width="24" height="24" rx="2" fill="currentColor" fillOpacity="0.2"/>
        <rect x="10" y="25" width="12" height="2" rx="1" fill="white"/>
        <rect x="14" y="5" width="4" height="2" rx="1" fill="white"/>
    </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153zm-1.61 19.713h2.54l-14.976-17.14H4.38l12.911 17.14z"/>
    </svg>
);

export const QuoteFocusLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <path d="M11.6667 16H16V11.6667C16 10.0094 14.6573 8.66667 13 8.66667C12.0667 8.66667 11.2 9.13333 10.6667 9.8L8.8 8.46667C9.8 7.26667 11.3333 6.5 13 6.5C15.9 6.5 18.2 8.8 18.2 11.6667V18.1667H11.6667V16ZM22.6667 16H27V11.6667C27 10.0094 25.6573 8.66667 24 8.66667C23.0667 8.66667 22.2 9.13333 21.6667 9.8L19.8 8.46667C20.8 7.26667 22.3333 6.5 24 6.5C26.9 6.5 29.2 8.8 29.2 11.6667V18.1667H22.6667V16Z" fill="currentColor" fillOpacity="0.4"/>
        <rect x="7" y="21" width="18" height="2" rx="1" fill="currentColor" fillOpacity="0.8"/>
    </svg>
);
export const NewsBannerLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <rect y="22" width="32" height="10" fill="currentColor" fillOpacity="0.8"/>
        <rect x="13" y="26" width="14" height="2" rx="1" fill="white"/>
        <rect x="5" y="25" width="4" height="4" rx="1" fill="white" fillOpacity="0.8"/>
    </svg>
);

export const RTNewsLayoutIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="4" fill="currentColor" fillOpacity="0.2"/>
        <rect x="4" y="4" width="7" height="4" rx="1" fill="currentColor" fillOpacity="0.8"/>
        <rect y="21" width="32" height="7" fill="currentColor" fillOpacity="0.1"/>
        <rect x="6" y="23" width="6" height="2" rx="1" fill="currentColor" fillOpacity="0.8"/> 
        <rect x="13" y="23" width="13" height="2" rx="1" fill="currentColor" fillOpacity="0.5"/> 
        <rect y="28" width="32" height="4" fill="currentColor" fillOpacity="0.9"/>
        <path d="M0 28H8L6 32H0V28Z" fill="currentColor" fillOpacity="0.6"/>
        <rect x="22" y="29.5" width="6" height="1" rx="0.5" fill="white"/>
    </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const PencilIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const quoteIconPath = 'M8.2,4.6C9.3,4.1,10.2,3.4,11,2.5c-1.2,1.1-2.5,2.1-3.9,2.9C6,5.9,5,6.3,3.9,6.6V12h6.8V4.6z M18.2,4.6C19.3,4.1,20.2,3.4,21,2.5c-1.2,1.1-2.5,2.1-3.9,2.9C16,5.9,15,6.3,13.9,6.6V12h6.8V4.6z';

export const FacebookIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.675 0h-21.35c-0.732 0-1.325 0.593-1.325 1.325v21.351c0 0.731 0.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463 0.099 2.795 0.143v3.24l-1.918 0.001c-1.504 0-1.795 0.715-1.795 1.763v2.313h3.587l-0.467 3.622h-3.12v9.293h6.081c0.73 0 1.325-0.593 1.325-1.325v-21.35c0-0.732-0.593-1.325-1.325-1.325z"/>
    </svg>
);

export const InstagramIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584 0.012 4.85 0.07 3.252 0.148 4.771 1.691 4.919 4.919 0.058 1.265 0.07 1.646 0.07 4.85s-0.012 3.584-0.07 4.85c-0.148 3.227-1.669 4.771-4.919 4.919-1.266 0.058-1.646 0.07-4.85 0.07s-3.584-0.012-4.85-0.07c-3.252-0.148-4.771-1.691-4.919-4.919-0.058-1.265-0.07-1.646-0.07-4.85s0.012-3.584 0.07-4.85c0.148-3.227 1.669 4.771 4.919 4.919 1.266-0.058 1.646-0.07 4.85-0.07zm0-2.163c-3.264 0-3.664 0.012-4.943 0.07-4.322 0.198-6.131 2.008-6.329 6.329-0.058 1.279-0.07 1.679-0.07 4.943s0.012 3.664 0.07 4.943c0.198 4.322 2.008 6.131 6.329 6.329 1.279 0.058 1.679 0.07 4.943 0.07s3.664-0.012 4.943-0.07c4.322-0.198 6.131-2.008 6.329-6.329 0.058 1.279 0.07-1.679 0.07-4.943s-0.012-3.664-0.07-4.943c-0.198-4.322-2.008-6.131-6.329-6.329-1.279-0.058-1.679-0.07-4.943-0.07zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm4.802-11.884c-0.796 0-1.441 0.645-1.441 1.441s0.645 1.441 1.441 1.441 1.441-0.645 1.441-1.441-0.645-1.441-1.441-1.441z"/>
    </svg>
);

export const LinkedInIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

export const WebsiteIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.866 2.05C15.0123 2.50233 16.9038 3.79155 18.228 5.59602C19.5521 7.40049 20.218 9.64531 20.0945 11.9114C19.9711 14.1775 19.0689 16.3114 17.5587 17.9157C16.0485 19.5199 13.045 20.5 10.134 20.05C7.22298 19.6 5.13398 17.8005 3.77202 15.404C2.41006 12.9995 1.90553 10.1547 2.40902 7.40049C2.91251 4.64627 4.54053 2.50233 7.13402 2.05C8.86602 1.8 11.134 1.8 12.866 2.05ZM13 12C13 15.3137 10.3137 18 7 18C7 16.5168 7.37622 15.0934 8.05202 13.8458C8.72782 12.5982 9.67056 11.5714 10.7574 10.866C11.8442 10.1606 13 9.31371 13 8C13 6.68629 11.8442 5.8394 10.7574 5.13398C9.67056 4.42857 8.72782 3.40181 8.05202 2.15418C7.37622 0.906553 7 0 7 0C10.3137 0 13 2.68629 13 6V12Z"/>
    </svg>
);

export const LogoPositionIcon: React.FC<IconProps & { position: LogoPosition }> = ({ position, ...props }) => {
    let rectProps = {};
    const commonProps = { width: 8, height: 6, rx: 1 };
    switch (position) {
        case 'top-left': rectProps = { x: 4, y: 4, ...commonProps }; break;
        case 'top-right': rectProps = { x: 12, y: 4, ...commonProps }; break;
        case 'center': rectProps = { x: 8, y: 9, ...commonProps }; break;
        case 'bottom-left': rectProps = { x: 4, y: 14, ...commonProps }; break;
        case 'bottom-right': rectProps = { x: 12, y: 14, ...commonProps }; break;
    }

    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
            <rect {...rectProps} fill="currentColor"/>
        </svg>
    );
};

export const AspectRatioIcon: React.FC<IconProps & { ratio: AspectRatio }> = ({ ratio, ...props }) => {
    let rectProps = {};
    switch (ratio) {
        case '4:5': rectProps = { x: 5, y: 2, width: 14, height: 17.5, rx: 2 }; break;
        case '16:9': rectProps = { x: 2, y: 6.5, width: 20, height: 11.25, rx: 2 }; break;
        case '1:1':
        default: rectProps = { x: 4, y: 4, width: 16, height: 16, rx: 2 }; break;
    }
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <rect {...rectProps} fill="currentColor" fillOpacity="0.8"/>
        </svg>
    );
};

export const templates: { name: DesignTemplate, Icon: React.FC<any> }[] = [
    { name: 'classic', Icon: ClassicLayoutIcon },
    { name: 'top-bar', Icon: TopBarLayoutIcon },
    { name: 'heavy-bottom', Icon: HeavyBottomLayoutIcon },
    { name: 'split-vertical', Icon: SplitVerticalLayoutIcon },
    { name: 'minimal', Icon: MinimalLayoutIcon },
    { name: 'framed', Icon: FramedLayoutIcon },
    { name: 'quote-focus', Icon: QuoteFocusLayoutIcon },
    { name: 'news-banner', Icon: NewsBannerLayoutIcon },
    { name: 'rt-news', Icon: RTNewsLayoutIcon },
];
