'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "./firebase/auth";
import NavBar from "@/components/NavBar";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "./firebase/config";
import { useEffect, useState } from "react";
import Image from "next/image";


export default function Home() {

  const { authUser, isloading, signOut } = useAuth();

  const [allPosts, setAllPosts] = useState([]);


  useEffect(()=>{
    fetchPosts();
},[])

const fetchPosts = async () => {
  try {
    const q = query(collection(db, "posts"));
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
    <NavBar/>
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold opacity-45">Posts</h1>
      <div className="flex flex-col">

      {allPosts.length > 0 &&
          allPosts.map((post, index) => (
            <div className="flex justify-between border-t-2 p-2 w-[800px]">

            <h2 className="text-xl font-semibold">{post.title}</h2>
          
            <Image className="w-40 m-2 h-24 object-cover rounded-md" src={post.thumbnailUrl} width={300} height={300}/>
            
            </div>
          ))
        }
        

      </div>
    </main>
    </>
  );
}
