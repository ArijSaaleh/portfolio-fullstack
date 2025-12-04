import { Button } from "./ui/button";
import FadeIn from "./animations/FadeIn";
import { Linkedin, Mail, Github } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center py-20 bg-background relative overflow-hidden">
      {/* Chess-themed Background Pattern */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Chess board pattern - 8x8 grid with alternating primary colored squares */}
        <div className="w-[640px] h-[640px] grid grid-cols-8 grid-rows-8 opacity-80">
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isGreen = (row + col) % 2 === 0;
            return (
              <div
                key={i}
                className={`w-20 h-20 ${
                  isGreen
                    ? "bg-primary/20 dark:bg-primary/10"
                    : "bg-transparent"
                }`}
              />
            );
          })}
        </div>

        {/* Large decorative chess piece symbols */}
        <div className="absolute top-16 right-16 text-[200px] text-primary/20 dark:text-primary/10 leading-none select-none">
          ♞
        </div>
        <div className="absolute top-16 left-14 text-[150px] text-primary/20 dark:text-primary/10 leading-none select-none">
          ♜
        </div>
        <div className="absolute top-1/3 left-1/2 text-[100px] text-primary/15 dark:text-primary/8 leading-none select-none">
          ♟
        </div>
        <div className="absolute bottom-16 left-12 text-[150px] text-primary/20 dark:text-primary/10 leading-none select-none">
          ♚
        </div>
        <div className="absolute top-1/3 left-1/4 text-[100px] text-primary/15 dark:text-primary/8 leading-none select-none">
          ♜
        </div>
        <div className="absolute top-2/3 right-16 text-[180px] text-primary/15 dark:text-primary/8 leading-none select-none">
          ♕
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Profile Image with Chess Frame */}
          <FadeIn direction="left" duration={1000}>
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Decorative chess-themed circular frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full" />
                <div className="absolute -inset-2 bg-gradient-to-tl from-primary/20 via-primary/10 to-transparent rounded-full" />

                {/* Main circular image */}
                <div className="relative rounded-full overflow-hidden shadow-2xl border-8 border-background aspect-square">
                  <img
                    src="https://media.licdn.com/dms/image/v2/D4D03AQG3KVSzLBXgdw/profile-displayphoto-crop_800_800/B4DZl8u2zFIgAI-/0/1758734284772?e=1766620800&v=beta&t=ojldDRpQ3bQ9WcIOSe82iGIV2S2DwSBmTUriUWGVtfw"
                    alt="Arij SALEH"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                </div>

                {/* Floating chess piece decorations */}
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary shadow-lg">
                  <span className="text-5xl">♔</span>
                </div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-primary shadow-lg">
                  <span className="text-4xl">♞</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Text Content */}
          <div className="space-y-6">
            <FadeIn direction="up" delay={200} duration={800}>
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
                <span className="text-sm font-medium text-primary">
                  Strategic Thinker • Problem Solver
                </span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={400} duration={800}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Arij SALEH
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={600} duration={800}>
              <h2 className="text-2xl md:text-3xl font-semibold text-primary">
                IoT & Embedded Software Engineer
              </h2>
            </FadeIn>

            <FadeIn direction="up" delay={800} duration={800}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Like chess, engineering requires strategic thinking, calculated
                moves, and the ability to see several steps ahead. I craft
                intelligent embedded systems that drive innovation in IoT.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={1000} duration={800}>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" asChild className="group">
                  <a href="#projects" className="gap-2">
                    View Projects
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#contact" className="gap-2">
                    Get in Touch
                  </a>
                </Button>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={1200} duration={800}>
              <div className="flex gap-4 pt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="rounded-full"
                >
                  <a
                    href="https://linkedin.com/in/arijsaleh"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="rounded-full"
                >
                  <a
                    href="https://github.com/arijsaleh"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="rounded-full"
                >
                  <a href="mailto:arij.saleh@example.com" aria-label="Email">
                    <Mail className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
