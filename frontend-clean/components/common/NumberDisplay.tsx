import React, { useState, useEffect } from 'react';

interface NumberDisplayProps {
    value: number;
    className?: string;
    suffix?: string;
    duration?: number;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({
    value,
    className = '',
    suffix = '',
    duration = 2000
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationId: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOutCubic * value);

            setDisplayValue(currentValue);

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            }
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [value, duration]);

    return (
        <span className={className}>
            {displayValue.toLocaleString()}{suffix}
        </span>
    );
};

export default NumberDisplay;
