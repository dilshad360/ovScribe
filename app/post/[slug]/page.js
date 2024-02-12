"use client";

import { db } from "@/app/firebase/config";
import NavBar from "@/components/NavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
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
            console.log(data);
            setPost(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <NavBar />
            <main className="flex min-h-screen flex-col items-center p-24">
            { post.length > 0 && ( <div className="px-64">
                
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
