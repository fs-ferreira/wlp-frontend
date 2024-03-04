"use client"
import { useSession } from "next-auth/react"

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <>
      <h1>oi {session?.user?.name}</h1>
    </>
  )
}