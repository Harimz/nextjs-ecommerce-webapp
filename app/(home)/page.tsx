import { Button } from "@/components/ui/button";
import { UserButton } from "@/features/user/components/user-button";
import { getCurrent } from "@/features/user/queries";

export default async function Home() {
  const session = await getCurrent();

  return <div>Homepage</div>;
}
