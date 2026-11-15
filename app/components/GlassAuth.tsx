import { ReactNode } from "react";

/** Background + glass card layout shared by the customer log in and sign up pages (Figma). */
export function GlassBackground({ image, children }: { image: string; children: ReactNode }) {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative flex flex-col md:flex-row gap-6 md:gap-[96px] items-stretch w-full max-w-[905px]">{children}</div>
    </main>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border border-white/30 bg-white/25 backdrop-blur-md shadow-xl text-ink ${className}`}>{children}</div>
  );
}

export function PillInput({ icon, label, ...props }: { icon: ReactNode; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 h-10 rounded-full bg-white/50 px-3 focus-within:ring-2 focus-within:ring-gold">
      <span className="text-xl shrink-0" aria-hidden>{icon}</span>
      <span className="sr-only">{label}</span>
      <input {...props} placeholder={label} className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-ink/50" />
    </label>
  );
}
