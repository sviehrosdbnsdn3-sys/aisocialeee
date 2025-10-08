
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
