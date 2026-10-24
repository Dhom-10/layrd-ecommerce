import { ProductTag as Tag } from "@/types/models";

// The three tag styles from the Figma design (LIMITED / CLASSIC / POPULAR).
const tagStyles: Record<Exclude<Tag, "">, string> = {
  LIMITED: "bg-gold text-white font-light shadow-[inset_0px_4px_5px_0px_#bc9929]",
  CLASSIC: "bg-white text-ink shadow-[inset_0px_4px_5px_0px_#e0e0e0]",
  POPULAR: "bg-ink text-announce shadow-[inset_0px_4px_5px_0px_#0f0f0f]",
};

export default function ProductTag({ tag, size = "md" }: { tag: Tag; size?: "sm" | "md" }) {
  if (!tag) return null;

  const sizeClass = size === "sm" ? "w-[86px] h-[18px] text-[10px]" : "w-[122px] h-[25px] text-base";

  return (
    <span
      className={`absolute right-0 top-5 sm:top-8 flex items-center justify-center border-r-2 border-gold tracking-[0.15em] ${sizeClass} ${tagStyles[tag]}`}
    >
      {tag}
    </span>
  );
}
