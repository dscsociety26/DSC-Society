import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import cloth1 from "@/assets/cloth1.jpeg";
import plant1 from "@/assets/plant1.jpeg";
import clean1 from "@/assets/clean1.jpeg";
import clean5 from "@/assets/clean5.jpeg";
import cloth3 from "@/assets/cloth3.jpeg";

const slides = [cloth1, plant1, clean1, clean5, cloth3];

const HeroSlider = () => {

const [current, setCurrent] = useState(0);

useEffect(() => {
const timer = setInterval(() => {
setCurrent((p) => (p + 1) % slides.length);
}, 5000);

return () => clearInterval(timer);

}, []);

return (
<section className="relative h-screen w-full overflow-hidden">

<AnimatePresence mode="wait">
<motion.div
key={current}
initial={{ opacity:0, scale:1.1 }}
animate={{ opacity:1, scale:1 }}
exit={{ opacity:0 }}
transition={{ duration:1 }}
className="absolute inset-0"
>
<img
src={slides[current]}
alt="Hero"
className="h-full w-full object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-b from-dsc-dark/60 via-dsc-dark/40 to-dsc-dark/70" />

</motion.div>
</AnimatePresence>


{/* Hero Content */}
<div className="relative z-10 flex h-full items-center justify-center">
<div className="text-center">

<motion.div
initial={{ opacity:0, y:20 }}
animate={{ opacity:1, y:0 }}
transition={{ delay:0.9, duration:0.8 }}
className="mt-8 flex flex-wrap justify-center gap-4"
>

<Button
asChild
size="lg"
className="gradient-green border-0 text-primary-foreground font-heading font-semibold text-base px-8"
>
<Link to="/join-us">
Join Us
</Link>
</Button>

<Button
asChild
size="lg"
variant="outline"
className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 font-heading font-semibold text-base px-8"
>
<Link to="/focus-areas">
Explore Our Work
</Link>
</Button>

</motion.div>

</div>
</div>


{/* Navigation Dots */}
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
{slides.map((_, i) => (
<button
key={i}
onClick={() => setCurrent(i)}
className={`w-3 h-3 rounded-full transition-all ${
i === current
? "bg-primary-foreground w-8"
: "bg-primary-foreground/40"
}`}
 />
))}
</div>


{/* Left Arrow */}
<button
onClick={() =>
setCurrent((p)=>(p-1+slides.length)%slides.length)
}
className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
>
<ChevronLeft size={20}/>
</button>


{/* Right Arrow */}
<button
onClick={() =>
setCurrent((p)=>(p+1)%slides.length)
}
className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
>
<ChevronRight size={20}/>
</button>

</section>
);
};

export default HeroSlider;
