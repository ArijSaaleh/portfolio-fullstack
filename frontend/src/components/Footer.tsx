export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex justify-center gap-6 mb-4">
          <a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">
            Projects
          </a>
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </a>
          <a href="#blog" className="text-muted-foreground hover:text-primary transition-colors">
            Blog
          </a>
          <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
        <p className="text-center text-muted-foreground text-sm">
          &copy; 2025 Arij SALEH. All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}
