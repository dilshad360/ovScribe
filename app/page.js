"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "./firebase/auth";
import NavBar from "@/components/NavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase/config";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { authUser, isloading, signOut } = useAuth();

  const [allPosts, setAllPosts] = useState([]);

  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        where("status", "==", "APPROVED")
      );
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setAllPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center md:p-24">
        <h1 className="text-4xl font-bold  mb-5">Posts</h1>
        <div className="flex flex-col justify-center items-center">
          {allPosts.length > 0 &&
            allPosts.map((post, index) => (
              <div className="flex md:flex-row flex-col justify-between border-t-2 p-4 w-11/12 md:w-4/6">
                <div
                  className="cursor-pointer md:w-9/12 "
                  onClick={() => {
                    router.push(`/post/${post.slug}`);
                  }}
                >
                  <h2 className="text-xl font-semibold ">{post.title}</h2>
                  <p className="mt-3  text-muted-foreground">
                    {post.summary + "..."}
                  </p>
                </div>

                <div
                  className="pt-2 md:pt-0  md:w-3/12 cursor-pointer"
                  onClick={() => {
                    router.push(`/post/${post.slug}`);
                  }}
                >
                  <Image
                    className="min-w-40 h-36 md:h-24 object-cover rounded-md"
                    src={post.thumbnailUrl}
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
