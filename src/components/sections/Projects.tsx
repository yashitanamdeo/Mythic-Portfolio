"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useContent } from "@/content/ContentProvider";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";

function highlightBody(body: string, highlights: string[]) {
  let html = body;
  for (const h of highlights) {
    html = html.replaceAll(h, `<strong class="font-medium text-accent">${h}</strong>`);
  }
  return html;
}

function ProjectVisual({
  image,
  num,
  title,
}: {
  image?: string;
  num: string;
  title: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }

    // Green cover wipe when the frame hits ~82% of viewport (matches original).
    const revealIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          revealIo.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -18% 0px" },
    );
    revealIo.observe(el);

    // Subtle parallax scale while the card is in the scroll path.
    const inner = innerRef.current;
    let raf = 0;
    const onScroll = () => {
      if (!inner) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const progress = Math.min(1, Math.max(0, 1 - r.top / vh));
        const scale = 1.06 - progress * 0.06;
        inner.style.transform = `scale(${scale.toFixed(4)})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      revealIo.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="project-media project-visual relative overflow-hidden rounded bg-bg-soft"
    >
      <span className="absolute left-4 top-4 z-[3] rounded-full bg-accent px-[.7rem] py-[.3rem] font-display text-[.8rem] tracking-[.15em] text-black">
        {num}
      </span>
      {image ? (
        <div ref={innerRef} className="project-visual-inner absolute inset-0 will-change-transform">
          <Image
            src={image}
            alt={`${title} preview`}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          ref={innerRef}
          className="project-visual-inner absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-soft via-[#0b0b10] to-bg-soft will-change-transform"
        >
          <span className="font-display text-[4rem] font-semibold text-accent/80">{num}</span>
        </div>
      )}
      <div className="reveal-overlay" aria-hidden />
    </div>
  );
}

export function Projects() {
  const { projects } = useContent();

  return (
    <section
      id="projects"
      className="relative pad-x py-[clamp(2rem,6vh,3.5rem)] md:py-[clamp(5rem,12vh,11rem)]"
    >
      <Reveal>
        <div className="mb-[clamp(2.5rem,7vh,5.5rem)]">
          <p className="section-eyebrow mb-3">
            <span className="diamond" />
            {projects.sectionId}
          </p>
          <SectionHeading text={projects.headline} />
        </div>
      </Reveal>

      <div className="space-y-[clamp(3rem,9vh,6.5rem)]">
        {projects.items.map((p, i) => {
          const mediaLeft = i % 2 === 0;
          const highlights = [p.title.split(" ")[0], "content scripts", "sole engineer"].filter(
            (h) => p.body.toLowerCase().includes(h.toLowerCase()),
          );

          return (
            <Reveal key={p.num} delay={i * 40}>
              <article className="group grid grid-cols-1 gap-8 border-t border-white/[0.08] pt-10 lg:grid-cols-2 lg:gap-12">
                <div className={mediaLeft ? "lg:order-1" : "lg:order-2"}>
                  <ProjectVisual image={p.image} num={p.num} title={p.title} />
                </div>

                <div className={mediaLeft ? "lg:order-2" : "lg:order-1"}>
                  <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[.62rem] uppercase tracking-[.14em] text-faint">
                    <span>{p.category}</span>
                    <span className="text-white/20">/</span>
                    <span>{p.org}</span>
                    <span className="text-white/20">/</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.5rem)] font-semibold tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[clamp(1rem,1.5vw,1.15rem)] text-text/85">{p.tagline}</p>
                  <p
                    className="mt-5 max-w-[60ch] text-[clamp(.95rem,1.25vw,1.05rem)] leading-[1.7] text-text/80 [&_strong]:font-medium [&_strong]:text-accent"
                    dangerouslySetInnerHTML={{
                      __html: highlightBody(p.body, highlights.length ? highlights : [p.org]),
                    }}
                  />
                  <ul className="diamond-list mt-5 max-w-[60ch] space-y-2.5 text-[clamp(.9rem,1.15vw,1rem)] leading-[1.65] text-text/75">
                    {p.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-accent/60 pt-3 font-mono text-[.72rem] leading-[1.6] text-muted">
                    {p.outcome}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <li
                        key={tag}
                        className="border border-white/15 px-2.5 py-1 font-mono text-[.55rem] uppercase tracking-[.12em] text-muted transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
