import React from 'react'

export function LogoImage(props: React.ComponentPropsWithoutRef<'svg'>) {

    return (
        <>
            <svg width="60" height="60" viewBox="0 0 307 307" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_8_11)">
                    <circle cx="153.5" cy="149.5" r="149.5" fill="#1E1E1E"/>
                    <circle cx="221.5" cy="149.5" r="51.5" fill="white"/>
                    <circle cx="85.5" cy="149.5" r="51.5" fill="white"/>
                    <rect x="143" y="56" width="21" height="168" rx="2" fill="white"/>
                    <rect x="97" y="56" width="113" height="13" rx="2" fill="white"/>
                    <rect x="97" y="218" width="113" height="13" rx="2" fill="white"/>
                </g>
                <defs>
                    <filter id="filter0_d_8_11" x="0" y="0" width="307" height="307" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="4"/>
                        <feGaussianBlur stdDeviation="2"/>
                        <feComposite in2="hardAlpha" operator="out"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_8_11"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_8_11" result="shape"/>
                    </filter>
                </defs>
            </svg>

        </>
  );
};

export default LogoImage
