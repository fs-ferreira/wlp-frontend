"use client"

import { setupAPIClient } from "@/app/api/axios/api";
import CategoryForm from "@/components/category-form";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { TrashIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export async function loadCategories(token: string) {
  const api = setupAPIClient(token)
  const response = await api.get('/category');
  if (response.data) {
    return response.data
  }
  return []
}

export default function Category() {
  const [realoadList, setReloadList] = useState(false)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const { data: session, status } = useSession()

  useEffect(() => {
    setLoading(true)
    const baseCondition = status === "authenticated"
    const initialCondition = baseCondition && !categories.length
    const userBehaviorCondition = baseCondition && realoadList
    if (initialCondition || userBehaviorCondition) {
      handleLoad();
    }
  }, [status, realoadList])

  async function handleLoad() {
    await loadCategories(session!.token).then(res => {
      setCategories(res)
      setReloadList(false)
      setLoading(false)
    })
  }

  async function handleDelete(id: string) {
    if (session?.token) {
      const api = setupAPIClient(session.token)
      const response = await api.delete(`/category/${id}`)

      if (response.status == 204) {
        toast.success("Category successfully deleted!")
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
          <h1 className="font-bold text-2xl">Categories</h1>
          <CategoryForm loadFunction={handleLoad} />
        </div>
        {categories.length
          ?
          <Table>
            <TableHeader>
              <TableRow className="h-[60px]">
                <TableHead className="w-4/6">Name</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: any) => (
                <TableRow key={category.id} className="text-sm h-[60px]">
                  <TableCell className="font-medium max-h-">{category.name}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant={"destructive"}
                      className="hover:scale-105 transition-all"
                      onClick={() => handleDelete(category.id)}
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