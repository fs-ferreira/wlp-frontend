"use client"

import { setupAPIClient } from "@/app/api/axios/api";
import EmptyState from "@/components/empty-state";
import ProductForm from "@/components/product-form";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrashIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

async function loadData(token: string, category_id?: string) {
  const api = setupAPIClient(token)
  let query = ''
  if (category_id) {
    query = `category_id=${category_id}`
  }
  const response = (await api.get(`/product?${query}`));
  if (response.data) {
    return response.data
  }
  return []
}


export default function ProductPage() {
  const [realoadList, setReloadList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const { data: session, status } = useSession()

  useEffect(() => {
    setLoading(true)
    const baseCondition = status === "authenticated"
    const initialCondition = baseCondition && !products.length
    const userBehaviorCondition = baseCondition && realoadList
    if (initialCondition || userBehaviorCondition) {
      handleLoad();
    }
  }, [status, realoadList])

  async function handleLoad() {
    await loadData(session!.token).then(async res => {
      await setProducts(res)
      setReloadList(false)
      setLoading(false)
    })
  }

  async function handleDelete(id: string) {
    if (session?.token) {
      const api = setupAPIClient(session.token)
      const response = await api.delete(`/product/${id}`)

      if (response.status == 204) {
        toast.success("Product successfully deleted!")
        setReloadList(true)
      } else {
        toast.error("Something gone wrong!")
      }
    }
  }
  return (
    <>
      <div className="max-w-5xl mx-auto flex flex-col gap-6 mt-10 p-5 xl:p-0">
        <div className="flex flex-col gap-3 sm:flex-row justify-between">
          <h1 className="font-bold text-2xl">Products</h1>
          <ProductForm loadFunction={handleLoad} />
        </div>
        {products.length
          ?
          <Table className="">
            <TableHeader>
              <TableRow className="h-[60px]">
                <TableHead className="">Name</TableHead>
                <TableHead className="">Description</TableHead>
                <TableHead className="">Price($)</TableHead>
                <TableHead className="">Category</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id} className="text-sm h-[60px]">
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{parseFloat(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant={"destructive"}
                      className="hover:scale-105 transition-all"
                      onClick={() => handleDelete(product.id)}
                    >
                      <TrashIcon className="size-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          :
          !loading && <EmptyState />
        }

      </div>

    </>
  )
}