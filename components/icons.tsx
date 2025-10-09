
import React from 'react';

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

export const PencilIcon: React.FC<IconProps> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const quoteIconPath = 'M8.2,4.6C9.3,4.1,10.2,3.4,11,2.5c-1.2,1.1-2.5,2.1-3.9,2.9C6,5.9,5,6.3,3.9,6.6V12h6.8V4.6z M18.2,4.6C19.3,4.1,20.2,3.4,21,2.5c-1.2,1.1-2.5,2.1-3.9,2.9C16,5.9,15,6.3,13.9,6.6V12h6.8V4.6z';
