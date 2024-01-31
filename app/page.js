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
      <div>

      {allPosts.length > 0 &&
          allPosts.map((post, index) => (
            <>
            <p>{post.title}</p>
          
            <Image src={post.thumbnailUrl} width={300} height={300}/>


            </>
          ))
        }
        

      </div>
    </main>
    </>
  );
}
