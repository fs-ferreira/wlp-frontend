"use client"

import Image from "next/image"
import logo from "../../public/navicon.png"
import { ModeToggle } from "./ui/toggle-mode"
import Link from "next/link"

export default function Nav() {
  return (
    <header>
      <nav>
        <ul className="flex items-center justify-between p-2">
          <li>
            <Link href="/" className="">
              <Image src={logo} alt="Logo WLP!" width={150} priority />
            </Link>
          </li>
          <li>
            <ModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  )
}