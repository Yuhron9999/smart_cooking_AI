import HydrationSafe from './HydrationSafe';

interface NumberDisplayProps {
    value: number;
    suffix?: string;
    className?: string;
}

/**
 * Component hiển thị số an toàn khỏi hydration mismatch
 * Server và client có thể format số khác nhau (1.500 vs 1,500)
 */
export default function NumberDisplay({ value, suffix = '', className = '' }: NumberDisplayProps) {
    return (
        <HydrationSafe fallback={<span className={className}>{value}{suffix}</span>}>
            <span className={className}>
                {value.toLocaleString()}{suffix}
            </span>
        </HydrationSafe>
    );
}
