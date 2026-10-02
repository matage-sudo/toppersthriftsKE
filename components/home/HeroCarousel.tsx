"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const slides = [
  { image: "/caps/deadpool-flat-brim.jpg", title: "Deadpool Drop", subtitle: "Iconic. Bold. Only KES 1,500.", href: "/product/deadpool-flat-brim" },
  { image: "/caps/star-wars-classic.jpg", title: "Star Wars Collection", subtitle: "Join the Force. From KES 1,200.", href: "/product/star-wars-classic" },
  { image: "/caps/batman-comic-print.jpg", title: "Batman Comic Print", subtitle: "Gotham in every stitch.", href: "/product/batman-comic-print" },
  { image: "/caps/sf-giants-black.jpg", title: "SF Giants Classic", subtitle: "Bay Area staple. KES 2,500.", href: "/product/sf-giants-black" },
  { image: "/caps/dodgers-blue-classic.jpg", title: "LA Dodgers Classic", subtitle: "West Coast royalty. KES 2,300.", href: "/product/dodgers-blue-classic" },
  { image: "/caps/warriors-blue-snapback.jpg", title: "Golden State Warriors", subtitle: "Dubs for life. KES 2,200.", href: "/product/warriors-blue-snapback" },
  { image: "/caps/knicks-orange-black.jpg", title: "NY Knicks Two-Tone", subtitle: "Orange & black heat. KES 2,100.", href: "/product/knicks-orange-black" },
  { image: "/caps/notre-dame-fighting-irish.jpg", title: "Notre Dame Fighting Irish", subtitle: "Collector grade. KES 2,200.", href: "/product/notre-dame-fighting-irish" },
  { image: "/caps/nightmare-xmas.jpg", title: "Nightmare Before Christmas", subtitle: "Spooky szn, all year. KES 1,600.", href: "/product/nightmare-xmas" },
  { image: "/caps/hard-rock-floral.jpg", title: "Hard Rock Floral", subtitle: "Atlantic City vibes. KES 1,400.", href: "/product/hard-rock-floral" },
  { image: "/caps/blue-jays-classic.jpg", title: "Toronto Blue Jays", subtitle: "Fresh up north. KES 2,400.", href: "/product/blue-jays-classic" },
  { image: "/caps/celtics-white-snapback.jpg", title: "Boston Celtics White", subtitle: "Crisp & clean. KES 1,900.", href: "/product/celtics-white-snapback" },
];

export default function HeroCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: width * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % slides.length;
      scrollToSlide(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    const index = Math.round(scrollRef.current.scrollLeft / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <section className="relative rounded-2xl overflow-hidden mb-8">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {slides.map((slide, i) => (
          <Link
            key={i}
            href={slide.href}
            className="min-w-full snap-center relative aspect-[16/9] md:aspect-[21/9] block"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <h2 className="text-2xl md:text-4xl font-extrabold mb-2">
                {slide.title}
              </h2>
              <p className="text-sm md:text-base opacity-90">{slide.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? "w-8 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}