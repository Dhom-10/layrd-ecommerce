import Link from "next/link";
import { PiArrowRight } from "react-icons/pi";
import PortalLogin from "@/app/components/PortalLogin";

export default function WholesaleLoginPage() {
  return (
    <PortalLogin
      title="Wholesale"
      subtitle="Partner portal"
      allowed={["wholesale", "admin"]}
      redirectTo="/wholesale/catalog"
      background="/images/double-espresso.jpg"
      sidePanel={
        <>
          <p className="text-2xl font-medium tracking-[0.05em] drop-shadow">For approved partners.</p>
          <p className="mt-3 text-sm drop-shadow">
            Cafés, offices and event planners get wholesale pricing, bulk minimums and free delivery.
          </p>
          <Link
            href="mailto:wholesale@layrd.ca?subject=Wholesale%20account%20request"
            className="mt-auto flex min-h-[29px] items-center justify-between gap-2 rounded-full bg-gold pl-4 pr-1 py-0.5 text-ink text-xs"
          >
            New partner? Request a wholesale account
            <span className="size-[27px] rounded-full bg-gold flex items-center justify-center"><PiArrowRight /></span>
          </Link>
        </>
      }
    />
  );
}
