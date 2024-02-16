"use client";

import Link from "next/link";
import { Button } from "./ui";
import { useAuth } from "@/app/firebase/auth";
import Loader from "./loader";
import { SquarePen, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NavBar = () => {
  const { authUser, isloading, signOut } = useAuth();

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row justify-between items-center gap-2 py-1 px-6">
      <Link href="/">
        <h3 className="text-3xl font-bold">ovScribe</h3>
      </Link>
      <div>
        <div className="flex flex-row gap-3 m-4">
          {authUser ? (
            <>
              <Link href="/my-posts">
                <Button variant="link" className="font-semibold">My Posts</Button>
              </Link>
              <Link href="/create-post">
                <Button variant="outline"> <SquarePen className="mr-1 w-4" /> Write</Button>
              </Link>
              <Button variant="destructive" onClick={signOut}>
                Sign out
              </Button>
              <Avatar>
                <AvatarImage src="" />
                {authUser.username && (
                <AvatarFallback className="bg-white border font-semibold" >{authUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
