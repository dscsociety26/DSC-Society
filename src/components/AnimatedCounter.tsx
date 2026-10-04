import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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

  const inView = useInView(ref, {
    once: true,
    margin: "-50px",
  });

  const [count, setCount] = useState(0);

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

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(easedProgress * end);

      setCount(progress === 1 ? end : currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [inView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 16 }
      }
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="w-full text-center"
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
    </motion.div>
  );
};

export default AnimatedCounter;
