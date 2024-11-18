import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/auth/components/user-button";
import { getCurrent } from "@/features/auth/queries";

export default async function Home() {
  const session = await getCurrent();

  return <div>YAY!!!</div>;
}
