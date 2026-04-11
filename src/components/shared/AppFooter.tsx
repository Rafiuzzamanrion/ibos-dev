import Image from "next/image";
import { Phone, Mail } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 bg-[#1e1b4b] px-6 py-4 md:flex-row md:px-8">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-300">Powered by</span>
        <Image
          src="/Resource Logo 1 (1).png"
          alt="Akij Resource"
          width={100}
          height={28}
          className="brightness-0 invert"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 md:gap-6">
        <span className="font-medium text-white">Helpline</span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          +88 011020202505
        </span>
        <span className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" />
          support@akij.work
        </span>
      </div>
    </footer>
  );
}
