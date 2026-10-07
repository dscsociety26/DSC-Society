import { useEffect, useRef, useState } from "react";

interface Props {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

const AnimatedCounter = ({
  end,
  suffix = "",
  label,
  duration = 2,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -50px 0px",
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let animationFrame = 0;
    let startTime: number | null = null;

    const totalDuration = Math.max(duration, 0.1) * 1000;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easedProgress * end);

      setCount(progress === 1 ? end : currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, end, duration]);

  return (
    <div
      ref={ref}
      className={`w-full text-center transition-all duration-500 ease-out ${
        inView
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <div
        className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground tabular-nums whitespace-nowrap"
        aria-label={`${end.toLocaleString("en-IN")}${suffix} ${label}`}
      >
        {count.toLocaleString("en-IN")}
        {suffix}
      </div>

      <div className="mt-2 text-sm text-primary-foreground/80 font-medium">
        {label}
      </div>
    </div>
  );
};

export default AnimatedCounter;
