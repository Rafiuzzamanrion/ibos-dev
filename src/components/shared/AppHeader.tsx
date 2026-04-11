"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title = "Dashboard" }: AppHeaderProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = session?.user?.name || "User";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-[#1e1b4b] px-6 shadow-sm md:px-8">
      <div className="flex items-center gap-5">
        <Image
          src="/Resource Logo 1 (1).png"
          alt="Akij Resource"
          width={120}
          height={32}
          className="brightness-0 invert"
        />
        {title && (
          <>
            <div className="h-8 w-px bg-white/20" />
            <span className="text-base font-semibold text-white tracking-wide">{title}</span>
          </>
        )}
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/10"
          id="user-menu-button"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-300 text-xs font-medium text-gray-700">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-xs font-medium text-white">{userName}</p>
            <p className="text-[10px] text-gray-400">
              Ref. ID - {session?.user?.id?.slice(-8) || "00000000"}
            </p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border bg-white py-1 shadow-lg">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              id="logout-button"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
