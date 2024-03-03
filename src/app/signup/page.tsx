"use client"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messages } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import logo from "../../../public/logo.png"
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  const Login = z.object({
    name: z.string().min(1, { message: messages.required }),
    email: z.string().email().min(1, { message: messages.required }),
    password: z.string().min(1, { message: messages.required }),
  })

  const form = useForm<z.infer<typeof Login>>({
    resolver: zodResolver(Login),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof Login>) {
    console.log(values)
  }


  return (
    <>
      <div className="w-full p-4 flex flex-col gap-3 items-center justify-center">
        <Image src={logo} alt="Logo WLP" />
        <h1 className="font-bold text-lg sm:text-2xl">Create an account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full sm:w-2/3 lg:w-1/2 xl:w-1/3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Type your password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <div className="flex flex-col w-full gap-5 text-center">
          <Button type="submit" className="h-12">Sign up</Button>
          <Link href="/" className="">
            Already have an account? Login!
          </Link>
        </div>
          </form>
        </Form>
      </div>
    </>
  )
}