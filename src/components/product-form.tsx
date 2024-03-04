import { loadCategories } from "@/app/(user-routes)/category/page"
import { setupAPIClient } from "@/app/api/axios/api"
import { messages } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon } from "@radix-ui/react-icons"
import { useSession } from "next-auth/react"
import { ChangeEvent, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import RealoadButton from "./reload-button"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"

interface ProductFormProps {
  loadFunction: () => void
}


export default function ProductForm({ loadFunction }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession();
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [categories, setCategories] = useState([])

  async function handleLoad() {
    await loadCategories(session!.token).then(async res => {
      await setCategories(res)
    })
  }

  useEffect(() => {
    if (open) {
      handleLoad();
    }
  }, [open])

  const productSchema = z.object({
    name: z.string().min(1, { message: messages.required }),
    price: z.string().min(1, { message: messages.required }).regex(/^[+]?\d*([.,]?\d+)?$/, messages.numberOnly),
    description: z.string(),
    category_id: z.string().min(1, { message: messages.required })
  })

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      category_id: ""
    },
  })

  function handleResetForm() {
    setFile(null)
    setUrl('')
    form.reset();
  }

  async function handleSubmit(values: z.infer<typeof productSchema>) {
    setLoading(true)
    if (session?.token) {
      try {
        const data = new FormData()
        data.append('name', values.name)
        data.append('price', values.price)
        data.append('description', values.description)
        data.append('category_id', values.category_id)
        data.append('file', file)

        const api = setupAPIClient(session.token)
        await api.post('/product', data)
        toast.success("Product successfully created!")
        loadFunction();
        setOpen(false)
      } catch (err) {
        console.log(err);

        toast.error("Something gone wrong")
      }
    }
    setLoading(false)
  }

  function handlePickImage() {
    document.getElementById("imageInput").click()
  }

  function handleChangeImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return
    }
    const img = e.target.files[0]
    if (!img) {
      return
    }
    setFile(img)
    setUrl(URL.createObjectURL(img));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="space-x-1"
          onClick={handleResetForm}>
          <PlusIcon />
          <span>
            Add Product
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-auto max-h-lvh" >
        <DialogHeader className="space-y-2 mb-3">
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>
            Click save changes when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6 max-w-7xl md:mx-auto md:w-4/5 xl:w-3/5"
            onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="h-64 flex items-center justify-center rounded-md overflow-hidden ring-[1px] ring-black/15 dark:ring-secondary">
              <Input
                id="imageInput"
                onChange={handleChangeImage}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <Button
                className="absolute bg-transparent text-foreground hover:bg-transparent hover:scale-105 hover:ring-1 ring-primary transition-all"
                type="button"
                onClick={handlePickImage}>
                <PlusIcon />
              </Button>
              {url && <img src={url} alt="Product image" className="h-full w-full object-cover" />}
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Type product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="placeholder:textlg">
                        <SelectValue placeholder="Select a category" className="placeholder-muted" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="Type product price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product (optional)" rows={5} {...field} />
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