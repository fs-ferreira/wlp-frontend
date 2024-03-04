"use client"
import { setupAPIClient } from "@/app/api/axios/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { messages } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import RealoadButton from "./reload-button";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface CategoryFormProps {
  loadFunction: () => void
}

export default function CategoryForm({ loadFunction }: CategoryFormProps) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession();
  const [open, setOpen] = useState(false)

  const categorySchema = z.object({
    name: z.string().min(1, { message: messages.required }),
  })

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: ""
    },
  })

  function handleResetForm() {
    form.reset();
  }

  async function handleSubmit(values: z.infer<typeof categorySchema>) {
    setLoading(true)
    if (session?.token) {
      try {
        const api = setupAPIClient(session.token)
        await api.post('/category', values)

        toast.success("Category successfully created!")
        loadFunction();
        setOpen(false)
      } catch (err) {
        toast.error("Something gone wrong!")
      }
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-1"
          onClick={handleResetForm}>
          <PlusIcon />
          <span>
            Add category
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Click save changes when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <RealoadButton buttonName="Save changes" loading={loading} type="submit" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )

}