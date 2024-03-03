
import Image from "next/image";
import logo from '../../public/logo.png'
import LoginForm from "@/components/login-form";

export default function Home() {

  return (
    <>
      <div className="w-full p-4 flex flex-col gap-3 items-center justify-center">
        <Image src={logo} alt="Logo WLP" />
        <LoginForm />
      </div>
    </>
  );
}
