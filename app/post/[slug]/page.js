'use client'

import { db } from "@/app/firebase/config";
import NavBar from "@/components/NavBar";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect } from "react";

export default function Page({ params }) {

    useEffect(() => {

        fetchPost(params.slug);

    }, [])


    const fetchPost = async (slug) => {
        try {
            const q = query(collection(db, "posts"), where("slug", "==", slug));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            console.log(data)
            // setPosts(data);
        } catch (error) {
            console.error(error);
        }
    };



    return <div>
        <NavBar />

        My Post: {params.slug}

    </div>
}