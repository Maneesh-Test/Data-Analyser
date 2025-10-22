import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const LoaderIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export const FileIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const PdfIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <path d="M9 15a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9h-3v6z" />
    <path d="M4 12h2a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H4v4z" />
    <path d="M15 12h3" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

export const RefreshCwIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    </svg>
);

export const UserCircleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
);

export const KeyIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
);

export const FileTextIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
);

export const EyeIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const EyeOffIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a18.35 18.35 0 0 1-2.18 3.21" />
        <path d="M2.39 2.39 21.61 21.61" />
        <path d="M3.83 5.07A18.35 18.35 0 0 0 1 12c0 0 4 8 11 8a10.43 10.43 0 0 0 4.18-1.07" />
    </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

export const LogOutIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export const LogoIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" fillOpacity="0.5"/>
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ZapIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

export const ImageIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
    </svg>
);

export const CpuIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" />
        <line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" />
        <line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" />
        <line x1="20" y1="14" x2="23" y2="14" />
        <line x1="1" y1="9" x2="4" y2="9" />
        <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
);

export const QuoteIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14.017 21v-7.391c0-2.908.668-5.053 2.003-6.41 1.336-1.356 3.08-2.035 5.23-2.035v3.491c-1.336 0-2.334.388-2.994 1.164-.66.776-.99 1.931-.99 3.466v7.715h-5.249zm-12.017 0v-7.391c0-2.908.668-5.053 2.003-6.41 1.336-1.356 3.08-2.035 5.23-2.035v3.491c-1.336 0-2.334.388-2.994 1.164-.66.776-.99 1.931-.99 3.466v7.715h-5.249z"/>
    </svg>
);

export const LinkedInIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

export const InstagramIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/>
    </svg>
);

export const UploadCloudIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 16l-4-4-4 4M12 12v9" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        <path d="M16 16l-4-4-4 4" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export const Wand2Icon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
        <path d="m14 7 3 3" />
        <path d="M5 6v4" />
        <path d="M19 14v4" />
        <path d="M10 2v2" />
        <path d="M7 8H3" />
        <path d="M21 16h-4" />
        <path d="M11 3H9" />
    </svg>
);

export const SunIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

export const MoonIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export const OpenAIIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 41 41" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M38.2333 19.9511C38.2333 18.2526 38.0062 16.5938 37.5816 14.9945C36.9323 12.596 35.539 10.4243 33.5864 8.711C31.6338 7.00949 29.215 5.86791 26.6346 5.43391C24.0542 5.00427 21.4013 5.30456 18.9825 6.30211C16.5637 7.3082 14.4853 8.96131 12.9877 11.0833L16.2917 13.064L13.5208 11.0833C11.8177 12.9248 10.6092 15.138 10.0312 17.5453C9.45312 19.9526 9.53123 22.4786 10.2521 24.8761C10.9729 27.2736 12.3114 29.4352 14.1208 31.1485C15.9302 32.8618 18.1406 34.0547 20.5521 34.5828C22.9635 35.1109 25.4624 34.9511 27.8396 34.1245C30.2168 33.2979 32.3948 31.838 34.1562 29.8891L29.125 26.6911L33.2812 29.8891C34.9126 28.2312 36.1083 26.2447 36.7576 24.073C37.4069 21.9013 37.485 19.6109 36.9818 17.3995L38.2333 19.9511V19.9511Z M20.5 25.9928L17.2083 24.012C16.8208 24.2016 16.4062 24.3417 15.9792 24.4318L15.9792 24.4318C14.7354 24.6953 13.4396 24.4495 12.3125 23.7536C11.1854 23.0578 10.2917 21.962 9.79165 20.6703C9.29165 19.3786 9.21977 17.962 9.58956 16.6349C9.95936 15.3078 10.7479 14.1599 11.8229 13.4099C12.8979 12.66 14.1927 12.3599 15.4896 12.5401L20.5 15.6282V25.9928Z M20.5 21.1282L15.4896 18.0401C15.0594 17.8427 14.5854 17.8427 14.1552 18.0401C13.725 18.2375 13.3542 18.6183 13.125 19.0974L20.5 23.2532V21.1282Z M25.0417 24.012L20.5 20.814L20.5 15.6282L25.0417 12.5401C26.5417 13.1282 27.8333 14.2224 28.7083 15.6693C29.5833 17.1162 29.9864 18.8474 29.8333 20.5974C29.6802 22.3474 28.9812 23.9928 27.8396 25.2745L25.0417 24.012Z M33.5864 8.711C32.4449 7.42927 31.0208 6.4214 29.4271 5.79536C27.8333 5.16932 26.1146 4.94223 24.4166 5.13182C23.5042 5.23599 22.6104 5.48182 21.7812 5.85786L20.5 6.4214V23.2532L33.5864 8.711Z" />
    </svg>
);

export const AnthropicIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 19C16.0573 19 19.3462 15.9044 19.5 12C19.3462 8.09559 16.0573 5 12 5C7.94273 5 4.65382 8.09559 4.5 12C4.65382 15.9044 7.94273 19 12 19ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/>
    </svg>
);

export const PerplexityIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 19C16.0573 19 19.3462 15.9044 19.5 12C19.3462 8.09559 16.0573 5 12 5C7.94273 5 4.65382 8.09559 4.5 12C4.65382 15.9044 7.94273 19 12 19Z" />
        <path d="M12.0002 12.16V8.6C12.0002 7.56 12.8402 6.72 13.8802 6.72C14.9202 6.72 15.7602 7.56 15.7602 8.6C15.7602 9.64 14.9202 10.48 13.8802 10.48H10.3202V15.76H12.0002V12.16ZM10.3202 10.48C9.2802 10.48 8.4402 9.64 8.4402 8.6C8.4402 7.56 9.2802 6.72 10.3202 6.72C11.3602 6.72 12.2002 7.56 12.2002 8.6V10.48H10.3202Z" />
    </svg>
);

export const BrainCircuitIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 5a3 3 0 1 0-5.993.142" />
        <path d="M18 5a3 3 0 1 0-5.993.142" />
        <path d="M12 12a3 3 0 1 0-5.993.142" />
        <path d="M18 12a3 3 0 1 0-5.993.142" />
        <path d="M12 19a3 3 0 1 0-5.993.142" />
        <path d="M18 19a3 3 0 1 0-5.993.142" />
        <path d="M12 5v0a3 3 0 0 0 5.994-.142" />
        <path d="M6.007 5.142A3 3 0 0 0 12 5h0" />
        <path d="M12 12v0a3 3 0 0 0 5.994-.142" />
        <path d="M6.007 12.142A3 3 0 0 0 12 12h0" />
        <path d="M12 19v0a3 3 0 0 0 5.994-.142" />
        <path d="M6.007 19.142A3 3 0 0 0 12 19h0" />
        <path d="m14 5.5.7 1" />
        <path d="m10 5.5-.7 1" />
        <path d="m14 12.5.7 1" />
        <path d="m10 12.5-.7 1" />
        <path d="m14 19.5.7 1" />
        <path d="m10 19.5-.7 1" />
    </svg>
);

export const GoogleIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.0001 12.0001L12.0001 11.9982C12.0001 10.0573 12.0001 8.80283 12.0001 6.00004C12.0001 5.48549 12.0001 5.22822 12.0001 5.00004C12.0001 4.5458 12.0001 4.31868 12.0001 4.14818C12.0001 3.90382 12.0001 3.68136 12.0001 3.23644L12.0001 3.23454C12.0001 2.34316 12.0001 1.90108 12.0001 1.5C12.0001 1.39343 12.0001 1.34015 12.0001 1.30303L12.0001 1.29999C12.0001 1.0504 12.0001 0.77124 12.0001 0.5H12C11.9999 0.77124 11.9999 1.0504 11.9999 1.29999L11.9999 1.30303C11.9999 1.34015 11.9999 1.39343 11.9999 1.5C11.9999 1.90108 11.9999 2.34316 11.9999 3.23454L11.9999 3.23644C11.9999 3.68136 11.9999 3.90382 11.9999 4.14818C11.9999 4.31868 11.9999 4.5458 11.9999 5.00004C11.9999 5.22822 11.9999 5.48549 11.9999 6.00004C11.9999 8.80283 11.9999 10.0573 11.9999 11.9982L11.9999 12.0001L12.0001 12.0001Z" fill="#4285F4"/>
      <path d="M12.0001 12.0001L12.0019 12.0001C13.9428 12.0001 15.1973 12.0001 18.0001 12.0001C18.5146 12.0001 18.7719 12.0001 19.0001 12.0001C19.4543 12.0001 19.6814 12.0001 19.8519 12.0001C20.0963 12.0001 20.3188 12.0001 20.7637 12.0001L20.7656 12.0001C21.657 12.0001 22.0991 12.0001 22.5001 12.0001C22.6067 12.0001 22.66 12.0001 22.6971 12.0001L23.0001 12.0001C23.2497 12.0001 23.5289 12.0001 24.0001 12.0001H23.5001C23.2289 12.0001 22.9497 12.0001 22.7001 12.0001L22.6971 12.0001C22.66 12.0001 22.6067 12.0001 22.5001 12.0001C22.0991 12.0001 21.657 12.0001 20.7656 12.0001L20.7637 12.0001C20.3188 12.0001 20.0963 12.0001 19.8519 12.0001C19.6814 12.0001 19.4543 12.0001 19.0001 12.0001C18.7719 12.0001 18.5146 12.0001 18.0001 12.0001C15.1973 12.0001 13.9428 12.0001 12.0019 12.0001L12.0001 12.0001Z" fill="#34A853"/>
      <path d="M12.0001 12.0001L12.0001 12.0019C12.0001 13.9428 12.0001 15.1973 12.0001 18C12.0001 18.5146 12.0001 18.7719 12.0001 19C12.0001 19.4543 12.0001 19.6814 12.0001 19.8519C12.0001 20.0963 12.0001 20.3188 12.0001 20.7637L12.0001 20.7656C12.0001 21.657 12.0001 22.0991 12.0001 22.5C12.0001 22.6067 12.0001 22.66 12.0001 22.6971L12.0001 23C12.0001 23.2497 12.0001 23.5289 12.0001 24H12C11.9999 23.5289 11.9999 23.2497 11.9999 23L11.9999 22.6971C11.9999 22.66 11.9999 22.6067 11.9999 22.5C11.9999 22.0991 11.9999 21.657 11.9999 20.7656L11.9999 20.7637C11.9999 20.3188 11.9999 20.0963 11.9999 19.8519C11.9999 19.6814 11.9999 19.4543 11.9999 19C11.9999 18.7719 11.9999 18.5146 11.9999 18C11.9999 15.1973 11.9999 13.9428 11.9999 12.0019L11.9999 12.0001L12.0001 12.0001Z" fill="#FBBC05"/>
      <path d="M12.0001 12.0001L11.9982 12.0001C10.0573 12.0001 8.80283 12.0001 6.00004 12.0001C5.48549 12.0001 5.22822 12.0001 5.00004 12.0001C4.5458 12.0001 4.31868 12.0001 4.14818 12.0001C3.90382 12.0001 3.68136 12.0001 3.23644 12.0001L3.23454 12.0001C2.34316 12.0001 1.90108 12.0001 1.5 12.0001C1.39343 12.0001 1.34015 12.0001 1.30303 12.0001L1.29999 12.0001C1.0504 12.0001 0.77124 12.0001 0.5 12.0001H1C1.27124 12.0001 1.5504 12.0001 1.79999 12.0001L1.80303 12.0001C1.84015 12.0001 1.89343 12.0001 2 12.0001C2.40108 12.0001 2.84316 12.0001 3.73454 12.0001L3.73644 12.0001C4.18136 12.0001 4.40382 12.0001 4.64818 12.0001C4.81868 12.0001 5.0458 12.0001 5.50004 12.0001C5.72822 12.0001 5.98549 12.0001 6.50004 12.0001C9.30283 12.0001 10.5573 12.0001 12.4982 12.0001L12.0001 12.0001Z" fill="#EA4335"/>
    </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

export const BarChartIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="20" x2="12" y2="10" />
        <line x1="18" y1="20" x2="18" y2="4" />
        <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
);

export const ListOrderedIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="10" x2="21" y1="6" y2="6"/>
        <line x1="10" x2="21" y1="12" y2="12"/>
        <line x1="10" x2="21" y1="18" y2="18"/>
        <path d="M4 6h1v4"/>
        <path d="M4 10h2"/>
        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
    </svg>
);

export const SendHorizontalIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m3 3 3 9-3 9 19-9Z"/>
        <path d="M6 12h16"/>
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9L12 21l1.9-5.8 5.8-1.9-5.8-1.9L12 3z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
    </svg>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

export const MessageSquareIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

export const CopyIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

export const PaperclipIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);

export const Trash2Icon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);