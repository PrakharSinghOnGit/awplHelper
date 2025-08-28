"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, Menu, PickaxeIcon } from "lucide-react";

const Navbar = () => {
  const navLinks = [
    { href: "#About", label: "About" },
    { href: "#Services", label: "Services" },
    { href: "#Contact", label: "Contact" },
  ];

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  return (
    <div
      className={`top-8 z-50 absolute flex flex-col w-[80vw] p-2 bg-background justify-between shadow-lg hover:shadow-sm rounded-xl`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center m-1 gap-3">
          <PickaxeIcon size={30} />
          <div
            className="text-2xl font-bold text-nowrap"
            style={{ fontFamily: "Bytesized" }}
          >
            AWPL HELPER
          </div>
        </div>

        <nav className="items-center justify-center hidden md:flex px-3">
          <ul className="flex gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div
          id="action"
          className="items-center justify-center gap-2 hidden md:flex"
        >
          <Button variant={"outline"}>Log in</Button>
          <Button>
            Sign Up
            <LogIn />
          </Button>
        </div>

        <div className="md:hidden flex items-center">
          <Button
            variant={"ghost"}
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="p-2"
          >
            <Menu />
          </Button>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? "max-h-96 mb-4" : "max-h-0 mb-0"
        }`}
      >
        <div className="flex flex-col p-2 space-y-1">
          {navLinks.map((link) => (
            <Button
              key={link.label}
              variant={"ghost"}
              className="justify-start"
            >
              <Link href={link.href} className="text-sm w-full text-left">
                {link.label}
              </Link>
            </Button>
          ))}

          <div className="border-t pt-2 mt-2">
            <Button variant={"ghost"} className="justify-start w-full">
              Log in
            </Button>
            <Button variant={"ghost"} className="justify-start w-full">
              <span className="flex items-center gap-2">
                Sign Up
                <LogIn animateOnHover={true} />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
