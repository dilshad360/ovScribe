"use client";

import { db } from "@/app/firebase/config";
import NavBar from "@/components/NavBar";
import TimeStamp from "@/components/TimeStamp";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page({ params }) {
    const [post, setPost] = useState([]);

    useEffect(() => {
        fetchPost(params.slug);
    }, []);

    const fetchPost = async (slug) => {
        try {
            const q = query(collection(db, "posts"), where("slug", "==", slug));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            // console.log(data);
            setPost(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <NavBar />
            <main className="flex min-h-screen flex-col items-center py-24">
            { post.length > 0 && ( <div className="w-11/12 md:w-6/12">

                <Image className="min-w-full md:h-[360px] object-cover rounded-md mb-8" alt="" src={post[0].thumbnailUrl} width={300} height={300} />
                

                <TimeStamp seconds={post[0].createdAt.seconds} nanoseconds={post[0].createdAt.nanoseconds} />
                <h3 className="text-3xl font-semibold">{post[0].title}</h3>
                <div
                className="pt-6"
                    dangerouslySetInnerHTML={{__html: post[0].content}}
                />

            </div>)}
            </main>
        </div>
    );
}
