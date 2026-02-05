'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

interface SmoothScrollProviderProps {
    children: ReactNode;
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
    return (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.2 }}>
            {children}
        </ReactLenis>
    );
}
