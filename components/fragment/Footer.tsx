import Link from "next/link";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerItemFadeOnly,
  viewportOnceTight,
} from "@/lib/animations";

const footerLinks = [
  { label: "Tentang Kami", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Hubungi Kami", href: "/contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <motion.footer
      id="footer"
      className="border-t border-stone-200 bg-white px-4 py-5"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnceTight}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <motion.p
          className="text-xs text-stone-400"
          variants={staggerItemFadeOnly}
        >
          &copy;{currentYear} Titip Jejak Indonesia. Bersama Memulangkan yang
          Terpisah.
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-5">
          {footerLinks.map((item) => (
            <motion.div key={item.href} variants={staggerItemFadeOnly}>
              <Link
                href={item.href}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
