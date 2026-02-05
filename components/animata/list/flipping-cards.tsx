import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
    show: React.ReactNode;
    reveal: React.ReactNode;
    className?: string; // Allow customizing the outer container
}

export const Card = ({ show, reveal, className }: CardProps) => {
    const common = "absolute top-0 left-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden";
    return (
        <div className={cn("group h-80 w-full [perspective:1000px]", className)}>
            <div
                className={cn(
                    "relative h-full w-full transition-all delay-75 duration-500 ease-linear [transform-style:preserve-3d] group-hover:[transform:rotateY(-180deg)]",
                )}
            >
                {/* Front side (Show) */}
                <div className={cn("bg-background border border-border/50", common)}>
                    {show}
                </div>

                {/* Back side (Reveal) */}
                <div
                    className={cn("[transform:rotateY(180deg)] bg-primary/5 border border-primary/20", common)}
                >
                    {reveal}
                </div>
            </div>
        </div>
    );
};

export default Card;
