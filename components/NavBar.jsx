"use client";

import Link from "next/link";
import { Button } from "./ui";
import { useAuth } from "@/app/firebase/auth";
import Loader from "./loader";
import { Bookmark, LogOut, Settings, SquarePen, UserRound, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react";
import { Badge } from "./ui/badge";

const NavBar = () => {

  const { authUser, isloading, signOut } = useAuth();
  const [showProfilePanel, setShowProfilePanel] = useState(false);

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row justify-between items-center gap-2 py-1 px-6">
      <Link href="/">
        <h3 className="md:text-3xl font-bold">ovScribe</h3>
      </Link>
      <div>
        <div className="flex flex-row gap-3 m-4">
          {authUser ? (
            <>

              <Link href="/user/bookmark" className="flex justify-center items-center">
                <Bookmark className="mr-1 w-5 hover:scale-125 hover:fill-black transition-all ease-in-out " />
              </Link>

              <Link href="/user/create-post">
                <Button variant="outline"> <SquarePen className="mr-1 w-4" /> Write</Button>
              </Link>

              <div>

                <Avatar className="cursor-pointer hover:shadow-md hover:scale-105 transition-all ease-in-out" onClick={() => { setShowProfilePanel(!showProfilePanel) }} >
                  <AvatarImage src={authUser.profileImage} />
                  {authUser.username && (
                    <>
                      {!showProfilePanel ?
                        <AvatarFallback className="bg-white border font-semibold" >{authUser.username.substring(0, 2).toUpperCase()}</AvatarFallback> :
                        <AvatarFallback className="bg-black border font-semibold text-white" >< X /></AvatarFallback>
                      }
                    </>
                  )}
                </Avatar>

                {showProfilePanel &&
                  <div className="w-[280px] bg-white absolute right-0 my-2 mx-10 rounded-xl shadow-lg border-2 flex justify-between items-center px-4 py-2 flex-col z-10">
                    <div className="flex  justify-end w-full">
                    </div>
                    <div className="flex flex-col items-center pt-6">
                      <Avatar className="scale-150" >
                        <AvatarImage src={authUser.profileImage} />
                        {authUser.username && (
                          <AvatarFallback className="bg-white border font-semibold" >{authUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col items-center pt-4 ">
                        <span className="text-lg font-semibold">{authUser.username}</span>
                        <span className="text-xs text-gray-500 pb-1" >{authUser.email}</span>
                        {authUser.role && authUser.role !== "user" &&
                          <Badge variant="outline">{authUser.role.toUpperCase()}</Badge>
                        }
                      </div>
                    </div>
                    <div className="w-full py-4 space-y-2 ">
                    <Link href="/user/my-posts">
                          <Button className="w-full" variant="ghost" >
                            My posts
                          </Button>
                        </Link>
                      {authUser.role && authUser.role !== "user" &&
                        <Link href="/manage/posts">
                          <Button className="w-full" variant="ghost" >
                            Manage posts
                          </Button>
                        </Link>
                      }
                      {authUser.role && authUser.role === "admin" &&
                        <Link href="/manage/users">
                          <Button className="w-full" variant="ghost" >
                            Manage users
                          </Button>
                        </Link>
                      }
                      <Link href="/user/settings">
                      <Button className="w-full" variant="ghost" >
                        <Settings className="mr-1 scale-75 opacity-75" />
                        Settings
                      </Button>
                      </Link>
                      <Button className="w-full text-red-600 border-red-600 hover:text-red-700 " variant="outline" onClick={signOut}>
                        <LogOut />
                      </Button>
                    </div>

                  </div>
                }


              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/signup">
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
