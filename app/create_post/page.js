"use client"

import NavBar from "@/components/NavBar"
import { Button, Input, Label, Textarea } from "@/components/ui";
import { useEffect, useState } from "react";
import { db, storage } from "../firebase/config";
import { useAuth } from "../firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";



export default function createPost() { 


    const { authUser , isloading } = useAuth();

    const [title, setTitle] = useState(null)
    const [content, setContent] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)

    const router = useRouter();


    useEffect(()=>{
        if(!isloading && !authUser) {
            router.push("/");
        }
    },[authUser, isloading])

    const sumbitHander = async() => {
        if (!title && !content) return
        try{

            // Upload image to Firebase Storage
        let thumbnailURL = "";
        if (thumbnail) {
        const storageRef = ref(storage, `thumbnails/${thumbnail.name}`);
        await uploadBytes(storageRef, thumbnail);
        thumbnailURL = await getDownloadURL(storageRef);
        }


            const docRef = await addDoc(collection(db, "posts"), {
                owner: authUser.uid,
                title: title,
                content: content,
                thumbnailUrl: thumbnailURL,
                createdAt: serverTimestamp(), 
                });

            toast.success("Successfully submitted")
        } catch(error){
            console.error(error)
    }
}

// const handleThumbnailChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
// }


return  isloading || (!isloading && !authUser) ? (
    <Loader />
) : (
        <>
            <NavBar/>
            <main className="flex min-h-screen flex-row justify-center items-center  py-10 ">
            <div className="w-[40%]">
            <h2 className="text-3xl font-bold mb-10">Create post</h2>
            <form className="flex flex-col gap-3" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <Label>Thumbnail</Label>
                <Input type="file" accept="image/*" onChange={(e)=>{
                    setThumbnail(e.target.files[0]);
                }} />
                <Label>Title</Label>
                <Input type="text" required onChange={(e) => {
                    setTitle(e.target.value);
                }} ></Input>
                <Label>Content</Label>

                <Textarea rows="10"  required onChange={(e) => {
                    setContent(e.target.value);
                }}/>

                <Button className="mt-2" type="submit" onClick={sumbitHander}  >Submit</Button>
            </form>
            </div>
            </main>
        </>
    )
}
