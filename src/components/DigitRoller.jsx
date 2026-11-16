/**
 * Rolling-digit year counter. Each digit is a 0–9 strip that translateY-spins
 * into place; non-digit characters (like "Now") render as plain glyphs.
 */
export default function DigitRoller({ value, className = '' }) {
  const chars = String(value ?? '').split('');

  return (
    <span className={`inline-flex items-baseline ${className}`} aria-label={String(value)}>
      {chars.map((char, i) => {
        const isDigit = /\d/.test(char);
        if (!isDigit) {
          return (
            <span key={`${char}-${i}`} className="inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        }
        const digit = Number(char);
        return (
          <span key={`${char}-${i}`} className="digit year-ghost" aria-hidden="true">
            <span
              className="digit__strip"
              style={{ transform: `translateY(-${digit}em)` }}
            >
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d} className="digit__cell">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
