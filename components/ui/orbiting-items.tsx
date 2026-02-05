'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface OrbitingItemsProps {
    /**
     * The radius of the circle in percentage, relative to the container.
     */
    radius: number;

    /**
     * The items to orbit around the center of the parent element.
     */
    items: React.ReactNode[];

    /**
     * Pause the animation when the parent element is hovered.
     */
    pauseOnHover?: boolean;

    /**
     * Class name for the background element.
     */
    backgroundClassName?: string;

    /**
     * Class name for the container element.
     */
    containerClassName?: string;

    /**
     * Additional classes for the item container.
     */
    className?: string;

    /**
     * Center content
     */
    centerContent?: React.ReactNode;
}

const calculateItemStyle = ({
    index,
    radius,
    totalItems,
}: {
    radius: number;
    index: number;
    totalItems: number;
}) => {
    const angle = (index / totalItems) * 360;
    const radians = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radians);
    const y = radius * Math.sin(radians);
    return {
        left: `${Number((50 + x).toFixed(2))}%`,
        top: `${Number((50 + y).toFixed(2))}%`,
        transform: 'translate(-50%, -50%)',
    };
};

export default function OrbitingItems({
    radius = 50,
    items = [],
    pauseOnHover,
    backgroundClassName,
    containerClassName,
    className,
    centerContent,
}: OrbitingItemsProps) {
    const reverse = cn('animate-rotate-full transition-transform ease-linear [animation-direction:reverse]', {
        'group-hover:[animation-play-state:paused]': pauseOnHover,
    });

    return (
        <div className={cn('flex items-center justify-center py-8', containerClassName)}>
            {backgroundClassName && (
                <div
                    className={cn(
                        'absolute inset-0 h-full w-full items-center',
                        backgroundClassName
                    )}
                />
            )}
            <div
                className={cn(
                    'group relative flex h-64 w-64 animate-rotate-full items-center justify-center ease-linear',
                    {
                        'group-hover:[animation-play-state:paused]': pauseOnHover,
                    },
                    className
                )}
            >
                <div className="absolute h-full w-full rounded-full border-2 border-gray-500/30" />
                {items.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg"
                            style={calculateItemStyle({
                                index,
                                radius,
                                totalItems: items.length,
                            })}
                        >
                            <div className={reverse}>{item}</div>
                        </div>
                    );
                })}

                <div className={cn('absolute h-1/2 w-1/2 rounded-full border-2 border-gray-700/20', reverse)} />

                {/* Center Content */}
                {centerContent && (
                    <div className={cn('absolute z-10', reverse)} style={{ transform: 'scaleX(-1)' }}>
                        {centerContent}
                    </div>
                )}
            </div>
        </div>
    );
}
