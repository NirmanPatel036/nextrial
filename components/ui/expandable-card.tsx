"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ExpandableCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  classNameExpanded?: string;
  icon?: React.ReactNode;
  [key: string]: any;
}

export function ExpandableCard({
  title,
  description,
  children,
  className,
  classNameExpanded,
  icon,
  ...props
}: ExpandableCardProps) {
  const [active, setActive] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "boolean") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={() => setActive(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div 
            className="fixed inset-0 z-50 grid place-items-center p-4"
            onClick={() => setActive(false)}
          >
            <motion.div
              layoutId={`card-${id}`}
              ref={ref}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-card/95 backdrop-blur-xl border border-border p-8 shadow-2xl",
                classNameExpanded
              )}
            >
              <motion.div layoutId={`header-${id}`} className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {icon && (
                      <motion.div layoutId={`icon-${id}`}>
                        {icon}
                      </motion.div>
                    )}
                    <div>
                      <motion.h3
                        layoutId={`title-${id}`}
                        className="text-xl font-bold text-foreground"
                      >
                        {title}
                      </motion.h3>
                      {description && (
                        <motion.p
                          layoutId={`description-${id}`}
                          className="text-sm text-muted-foreground mt-1"
                        >
                          {description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActive(false)}
                    className="flex-shrink-0 rounded-full p-2 hover:bg-muted transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-foreground"
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${id}`}
        onClick={() => setActive(true)}
        className={cn(
          "cursor-pointer rounded-xl bg-card/50 backdrop-blur-xl border border-border hover:border-primary/50 hover:shadow-lg hover:scale-[1.02] transition-all group p-6",
          className
        )}
        {...props}
      >
        <motion.div layoutId={`header-${id}`}>
          <div className="flex items-start gap-3">
            {icon && (
              <motion.div layoutId={`icon-${id}`} className="flex-shrink-0">
                {icon}
              </motion.div>
            )}
            <div className="flex-1">
              <motion.h3
                layoutId={`title-${id}`}
                className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors"
              >
                {title}
              </motion.h3>
              {description && (
                <motion.p
                  layoutId={`description-${id}`}
                  className="text-xs text-muted-foreground"
                >
                  {description}
                </motion.p>
              )}
            </div>
            <div className="text-muted-foreground group-hover:text-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
