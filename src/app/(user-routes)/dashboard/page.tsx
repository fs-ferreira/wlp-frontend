"use client"
import { setupAPIClient } from "@/app/api/axios/api"
import { Button } from "@/components/ui/button"
import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export async function loadOrders(token: string) {
  const api = setupAPIClient(token)
  const response = await api.get('/order');
  if (response.data) {
    return response.data
  }
  return []
}

export default function Dashboard() {
  const [orders, setOrders] = useState([])
  const { data: session, status } = useSession()

  async function handleLoad() {
    const data = await loadOrders(session.token)
    setOrders(data)
  }

  useEffect(() => {
    const baseCondition = status === "authenticated"
    if (baseCondition) {
      handleLoad();
    }
  }, [status])

  return (
    <>
      <div className="lg:max-w-[60%] xl:max-w-[50%] mx-auto p-5 space-y-10">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-xl sm:text-3xl">Last Orders</h1>
          <Button
          onClick={handleLoad}
            variant="ghost"
            className="text-lime-500 hover:text-lime-700 hover:bg-transparent hover:cursor-pointer hover:scale-110 transition-all p-2"
          >
            <UpdateIcon className="size-5 font-bold" />
          </Button>
        </div>

        <ul className="flex flex-col gap-5 w-full">
          {orders.map(order => (
            <li
              key={order.id}
              className="flex items-center overflow-hidden gap-2 h-14 
              rounded-md dark:bg-zinc-900 bg-zinc-100 shadow-lg  text-lg font-semibold
              hover:scale-110 hover:cursor-pointer"
            >
              <div className="h-full w-4 bg-lime-500 animate-pulse"></div>
              <div className="w-full pr-3 flex justify-between items-center">
                <span>
                  {`Table ${order.table}`}
                </span>
                <Button
                  variant="destructive"
                  className="hover:scale-105">
                  <TrashIcon className="size-5" />
                </Button>
              </div>
            </li>
          ))}

        </ul>
      </div>
    </>
  )
}