// components/MarqueeOnHover.js

import { useState, useRef, useLayoutEffect } from 'react';

/**
 * A component that displays text and applies a sliding (marquee) animation on hover
 * only if the text overflows its container.
 * @param {{ text: string }} props
 */
export default function MarqueeOnHover({ text }) {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    const [style, setStyle] = useState({});

    // Use useLayoutEffect to measure DOM elements after they are painted
    // but before the screen is updated, preventing flicker.
    useLayoutEffect(() => {
        // Reset styles when text changes to recalculate
        setStyle({
            transform: 'translateX(0)',
            transition: 'none', // Disable transition during reset
        });
    }, [text]);

    const handleMouseEnter = () => {
        const container = containerRef.current;
        const textEl = textRef.current;
        if (!container || !textEl) return;

        const containerWidth = container.clientWidth;
        const textWidth = textEl.scrollWidth;

        // Animate only if the text is wider than the container
        if (textWidth > containerWidth) {
            const distance = textWidth - containerWidth;
            // Duration is proportional to the distance, making the speed consistent
            const duration = Math.max(1500, distance * 15); // ms

            setStyle({
                transform: `translateX(-${distance}px)`,
                transition: `transform ${duration}ms linear`,
            });
        }
    };

    const handleMouseLeave = () => {
        // Smoothly transition back to the starting position
        setStyle({
            transform: 'translateX(0)',
            transition: 'transform 300ms ease-out',
        });
    };

    return (
        <div
            ref={containerRef}
            className="w-full overflow-hidden whitespace-nowrap"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={text} // Show full text on hover as a fallback
        >
            <span
                ref={textRef}
                className="inline-block"
                style={style}
            >
                {text}
            </span>
        </div>
    );
}