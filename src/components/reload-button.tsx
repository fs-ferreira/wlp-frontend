import { ReloadIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps } from "./ui/button";

interface RealoadButtonProps extends ButtonProps {
  loading: boolean,
  buttonName: string
}

export default function RealoadButton({ buttonName, loading }: RealoadButtonProps) {
  return (
    <Button type="submit" disabled={loading}>
      {loading ? <ReloadIcon className="animate-spin" /> : buttonName}
    </Button>
  )
}