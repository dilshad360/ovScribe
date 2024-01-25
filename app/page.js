import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {




  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      HomePage
      <div className="flex flex-row gap-3 m-4">
      <Button variant="ghost">Log in</Button>
      <Link href="/signup" >
      <Button >Sign up</Button>
      </Link>
      </div>
    </main>
  );
}
