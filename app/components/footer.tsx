import Link from "next/link";
import { PiInstagramLogo, PiShareNetwork } from "react-icons/pi";
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcApplePay, FaGooglePay } from "react-icons/fa";

const paymentIcons = [
  { Icon: FaCcVisa, label: "Visa" },
  { Icon: FaCcMastercard, label: "Mastercard" },
  { Icon: FaCcPaypal, label: "PayPal" },
  { Icon: FaCcApplePay, label: "Apple Pay" },
  { Icon: FaGooglePay, label: "Google Pay" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-light px-6 sm:px-20 pt-12 pb-8">
      <div className="max-w-[1280px] mx-auto grid gap-10 md:grid-cols-[338px_1fr]">
        {/* Logo + tagline */}
        <div className="text-center md:text-center">
          <p className="text-[56px] sm:text-[72px] leading-none tracking-[0.12em] text-white">LÄYRD</p>
          <p className="mt-6 text-base font-medium tracking-[0.05em] text-placeholder">
            Espresso Shots &amp; Cake-in-a-Can.
            <br />
            Made fresh. Kept simple.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 md:justify-self-end">
          <FooterColumn title="SUPPORT" links={["Shipping", "Request Refund", "Contact Us", "Wholesale"]} />
          <FooterColumn
            title="INFORMATION"
            links={["FAQ", "About LÄYRD", "Privacy Policy", "Terms of Service", "Community"]}
          />

          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-gold font-semibold text-xl tracking-[0.05em]">OUR NEWSLETTER</h4>
            <p className="mt-6 text-xs leading-5 font-medium tracking-[0.05em] underline max-w-[213px]">
              Join our newsletter to receive exclusive announcements, and offers !
            </p>
            <form className="mt-3" action="#">
              <label htmlFor="newsletter-email" className="sr-only">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Email Address"
                className="w-[208px] h-[27px] bg-transparent border border-light text-xs px-2 placeholder:text-placeholder"
              />
              <button type="submit" className="block mt-1 text-xs leading-5 font-medium tracking-[0.05em]">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="max-w-[1280px] mx-auto mt-12 flex flex-col md:flex-row gap-6 md:gap-0 items-center justify-between">
        <span className="text-base font-medium tracking-[0.05em] text-placeholder">
          ©2026 LÄYRD. ALL RIGHTS RESERVED.
        </span>

        <ul className="flex gap-3 text-white text-[40px]" aria-label="Payment methods">
          {paymentIcons.map(({ Icon, label }) => (
            <li key={label} title={label}>
              <Icon aria-label={label} />
            </li>
          ))}
        </ul>

        <div className="flex gap-2 text-gold text-[34px]">
          <button aria-label="Share">
            <PiShareNetwork />
          </button>
          <a href="https://www.instagram.com/l.a.y.r.d" target="_blank" rel="noreferrer" aria-label="Instagram">
            <PiInstagramLogo />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-gold font-semibold text-xl tracking-[0.05em]">{title}</h4>
      <ul className="mt-6">
        {links.map((link) => (
          <li key={link}>
            <Link href="#" className="text-xs leading-5 font-medium tracking-[0.05em] underline hover:text-gold">
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
