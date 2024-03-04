"use client"

import Image from "next/image"
import Link from "next/link"
import logo from "../../public/navicon.png"
import { ModeToggle } from "./ui/toggle-mode"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { ExitIcon } from "@radix-ui/react-icons"
import { Button } from "./ui/button"

export default function Nav() {
  const router = useRouter()
  
  async function handleLogout() {
    await signOut({
      redirect: false
    })
    router.replace('/')
  }

  return (
    <header>
      <nav>
        <ul className="flex items-center justify-between p-2">
          <li>
            <Link href="/dashboard">
              <Image src={logo} alt="Logo WLP!" className="w-24 sm:w-36" priority/>
            </Link>
          </li>
          <li className="flex items-center gap-3 sm:gap-6 sm:mr-3 text-xs sm:text-base">
            <Link href="/category" className="hover:text-primary transition">
              Category
            </Link>
            <Link href="/product" className="hover:text-primary transition">
              Products
            </Link>
            <div className="flex items-center gap-1 sm:gap-2 ">
              <ModeToggle/>
              <Button
                className="hover:scale-110 transition-transform"
                onClick={handleLogout}
                variant="outline"
                size="icon">
                <ExitIcon />
              </Button>
            </div>

          </li>
        </ul>
      </nav>
    </header>
  )
}