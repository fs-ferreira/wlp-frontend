import { setupAPIClient } from "@/app/api/axios/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface OrderDetailProps {
  tableNumber: number
  orderName?: string
  orderId: string
  loadFunction: () => void
}

async function detailOrder(token: string, id: string) {
  const api = setupAPIClient(token)
  const response = await api.get(`/order/${id}`);
  if (response.data) {
    return response.data
  }
  return []
}


export default function OrderDetail({ orderId, tableNumber, orderName, loadFunction }: OrderDetailProps) {
  const [order, setOrder] = useState([])
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const [orderTotal, setOrderTotal] = useState(0)

  async function handleLoad() {
    const data = await detailOrder(session.token, orderId)
    getTotal(data)
    setOrder(data)
  }

  async function handleCloseOrder() {
    try {
      const api = setupAPIClient(session.token)
      await api.put(`/order/close`, {
        id: orderId
      });
      toast.success("Order successfully closed!")
      loadFunction()
      setOpen(false)
    } catch(err) {
      toast.error("Error on close order.")
    }
  }

  function getTotal(items) {
    let total = 0

    items.forEach(item => {
      total += (item.amount * item.product.price)
    });
    setOrderTotal(total)
  }

  useEffect(() => {
    const baseCondition = status === "authenticated"
    if (baseCondition && open) {
      handleLoad();
    }
  }, [status, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="w-full text-left">
        {
          orderName ? `Table ${tableNumber} - ${orderName}` : `Table ${tableNumber}`
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Order details</DialogTitle>
          <DialogDescription className="text-lg">
            {
              orderName ? `Table: ${tableNumber} - ${orderName}` : `Table: ${tableNumber}`
            }
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {order.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between"
            >
              <span >
                {item.amount} - {item.product.name}
              </span>
              <span>
                $ {parseFloat(item.product.price).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <DialogFooter className="mt-6">
          <div
            className="flex gap-5 flex-col-reverse sm:flex-row sm:justify-between items-end sm:items-center w-full"
          >
            <Button
              className="bg-lime-600 hover:bg-lime-700"
              onClick={handleCloseOrder}
            >
              Finish order
            </Button>
            <div className="flex justify-end items-center gap-2">
              <span className="font-bold text-lg text-destructive">Total:</span>
              <span>$ {orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}