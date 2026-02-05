'use client';

import { useEffect, useRef, useState } from 'react';

export default function MagnifyingCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isInHero, setIsInHero] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if cursor is in hero section
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                const rect = heroSection.getBoundingClientRect();
                const inHero =
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom;
                setIsInHero(inHero);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!isInHero || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Capture the area under the cursor
        const magnifyRadius = 75;
        const zoomLevel = 2;

        const captureAndMagnify = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get the page content
            const x = position.x - magnifyRadius;
            const y = position.y - magnifyRadius;
            const size = magnifyRadius * 2;

            // Draw magnified circle
            ctx.save();
            ctx.beginPath();
            ctx.arc(magnifyRadius, magnifyRadius, magnifyRadius, 0, Math.PI * 2);
            ctx.clip();

            // Draw border
            ctx.strokeStyle = 'rgba(176, 90, 54, 0.8)';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.restore();

            // Outer glow
            ctx.save();
            ctx.shadowColor = 'rgba(176, 90, 54, 0.4)';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(magnifyRadius, magnifyRadius, magnifyRadius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(176, 90, 54, 0.6)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        };

        captureAndMagnify();
    }, [position, isInHero]);

    if (!isInHero) return null;

    return (
        <>
            <style jsx global>{`
        .hero-section {
          cursor: none !important;
        }
        .hero-section * {
          cursor: none !important;
        }
      `}</style>
            <div
                className="fixed pointer-events-none z-[9999]"
                style={{
                    left: position.x - 75,
                    top: position.y - 75,
                    width: 150,
                    height: 150,
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={150}
                    height={150}
                    className="w-full h-full"
                />
                {/* Magnifying glass handle */}
                <div
                    className="absolute bottom-0 right-0 w-1 h-8 bg-primary/60 rounded-full"
                    style={{
                        transform: 'rotate(45deg)',
                        transformOrigin: 'top center',
                    }}
                />
            </div>
        </>
    );
}
