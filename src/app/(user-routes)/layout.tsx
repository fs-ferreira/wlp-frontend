import Nav from "@/components/nav";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { nextAuthConfig } from "../api/auth/[...nextauth]/route";

interface PrivateLayoutProps {
  children: ReactNode
}

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await getServerSession(nextAuthConfig)

  if (!session) {
    redirect('/')
  }

  return <>
    <Nav />
    {children}
  </>
}