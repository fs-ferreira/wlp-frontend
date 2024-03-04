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
import { ReloadIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const Login = z.object({
    email: z.string().email({ message: messages.required }),
    password: z.string().min(1, { message: messages.required }),
  })

  const form = useForm<z.infer<typeof Login>>({
    resolver: zodResolver(Login),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleSubmit(values: z.infer<typeof Login>) {
    setLoading(true)
    const result = await signIn('credentials', {
      ...values,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {      
      toast.error(`${result.status} - Login not successful`)
      return;
    }

    toast.success("Login successful")
    router.replace('/dashboard')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full sm:w-2/3 lg:w-1/2 xl:w-1/3">
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
          <Button type="submit" className="h-12" disabled={loading}>
            {loading ? <ReloadIcon className="animate-spin" /> : 'Sign in'}
          </Button>
          <Button
            type="button"
            className="h-12"
            variant={"ghost"}
            asChild>
            <Link href="/signup">
              Sign up
            </Link>
          </Button>

        </div>
      </form>
    </Form>
  )
}