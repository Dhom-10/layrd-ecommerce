import Image from "next/image";
import { ReactNode } from "react";
import { money } from "@/lib/pricing";

export interface SummaryLine {
  key: string;
  name: string;
  detail?: string;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

interface Props {
  lines?: SummaryLine[];
  subtotal: number;
  shipping: number | null; // null = "Calculated at Checkout"
  tax: number;
  total: number;
  children?: ReactNode;
  className?: string;
}

/** Gold "Order Summary" box used on the cart, checkout and confirmation pages (Figma). */
export default function OrderSummaryCard({ lines, subtotal, shipping, tax, total, children, className = "" }: Props) {
  return (
    <aside
      className={`bg-gold/5 border border-gold border-t-[5px] rounded-[5px] px-6 sm:px-[27px] py-7 w-full lg:w-[420px] ${className}`}
    >
      <h2 className="text-2xl sm:text-[32px] font-semibold tracking-[0.05em] text-ink">Order Summary</h2>

      {lines && lines.length > 0 && (
        <ul className="mt-5 flex flex-col gap-[13px]">
          {lines.map((line) => (
            <li key={line.key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {line.imageUrl && (
                  <div className="relative size-[79px] shrink-0 overflow-hidden rounded-card border border-gold border-t-[3px]">
                    <Image src={line.imageUrl} alt={line.name} fill sizes="79px" className="object-cover" />
                  </div>
                )}
                <div className="text-[#353535]">
                  <p className="font-medium">{line.name}</p>
                  {line.detail && <p className="text-sm font-light">{line.detail}</p>}
                  <p className="font-light">x{line.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-[#353535]">{money(line.lineTotal)}</p>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-6 flex flex-col gap-3 text-[#353535]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{shipping === null ? "Calculated at Checkout" : shipping === 0 ? "Free" : money(shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Estimated Tax</dt>
          <dd>{money(tax)}</dd>
        </div>
      </dl>

      <div className="mt-6 pt-4 border-t border-gold/60 flex justify-between text-2xl sm:text-[32px] font-semibold tracking-[0.05em] text-ink">
        <span>Total</span>
        <span>{money(total)}</span>
      </div>

      {children}
    </aside>
  );
}
