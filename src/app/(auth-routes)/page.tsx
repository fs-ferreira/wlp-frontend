
import LoginForm from "@/components/login-form";
import Image from "next/image";
import logo from '../../../public/logo.png'

export default async function Home() {  
  return (
    <>
      <div className="w-full p-4 flex flex-col gap-3 items-center justify-center h-screen">
        <Image src={logo} alt="Logo WLP" priority/>
        <LoginForm />
      </div>
    </>
  );
}