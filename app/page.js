'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "./firebase/auth";


export default function Home() {

  const { authUser, isLoading, setAuthUser , signOut } = useAuth();


  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>ovScribe</h1>
      <div className="flex flex-row gap-3 m-4">
        <Link href="/login">
          <Button variant="ghost">Log in</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign up</Button>
        </Link>
      </div>
      {authUser && ( 
        <>
      <p>user : {authUser.email}</p>
      <Button onClick={signOut}>Sign out</Button>
      </>
      )
      
      }
      

    </main>
  );
}
