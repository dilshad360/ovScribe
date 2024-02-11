"use client"

import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { useAuth } from "../firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Image from "next/image";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui";
import { Trash } from "lucide-react";
import { toast } from "sonner";



export default function Login() {

    const { authUser, isloading, signOut } = useAuth();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!!authUser) {
            fetchPosts(authUser.uid);
        }
    }, [authUser])

    const fetchPosts = async (uid) => {
        try {
            const q = query(collection(db, "posts"), where("owner", "==", uid));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            console.log(data)
            setPosts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const deletePost = async (docId) => {
        try {
            await deleteDoc(doc(db, "posts", docId));
            toast.success("Post deleted successfully")
            fetchPosts(authUser.uid);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <NavBar />
            <main className="flex min-h-screen flex-col items-center   gap-16 py-24 ">
                <h4 className="text-2xl font-semibold">My Posts</h4>

                <div className="flex">
                    <Table className="">
                        <TableCaption>A list of my posts</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Title</TableHead>
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.length > 0 &&
                                posts.map((post, index) => (
                                    <TableRow key={index}>
                                        <TableCell> {post.title} </TableCell>
                                        <TableCell className="p-0">
                                            <Image className="w-12 m-2 h-8 object-cover rounded-md" src={post.thumbnailUrl} width={100} height={100} />
                                        </TableCell>
                                        <TableCell>

                                        </TableCell>
                                        <TableCell className="p-0 text-center">
                                            <Button variant="ghost" className="" size="icon" onClick={()=> deletePost(post.id)} >
                                                <Trash className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </div>

            </main>
        </>
    );
}
