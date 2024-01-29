'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "./firebase/auth";
import NavBar from "@/components/NavBar";


export default function Home() {

  const { authUser, isloading, signOut } = useAuth();

  return (
    <>
    <NavBar/>
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>ovScribe home page</h1>
    </main>
    </>
  );
}
