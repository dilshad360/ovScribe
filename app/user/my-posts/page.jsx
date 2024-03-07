"use client"

import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/auth";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import Image from "next/image";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui";
import { Eye, Inbox, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import withAuth from "../../middleware/auth";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";



function MyPosts() {

    const { authUser, isloading, signOut } = useAuth();

    const [posts, setPosts] = useState([]);

    const router = useRouter();

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
                <div className="flex shadow-md rounded-md w-11/12 md:w-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Title</TableHead>
                                <TableHead>Thumbnail</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.length > 0 ? (
                                posts.map((post, index) => (
                                    <TableRow key={index}>
                                        <TableCell> {post.title} </TableCell>
                                        <TableCell className="p-0 flex items-center justify-center">
                                            <Image className="w-12 m-2 h-8 object-cover rounded-md" src={post.thumbnailUrl} width={100} height={100} />
                                        </TableCell>
                                        <TableCell>
                                        <Badge variant="outline">{post.status}</Badge>
                                        </TableCell>
                                        <TableCell className="p-0 ">
                                            <Button variant="ghost" size="icon" onClick={()=> deletePost(post.id)} >
                                                <Trash className="h-4 w-4 text-red-600" />
                                            </Button>
                                            <Link href={`/user/edit-post/${post.id}`}>
                                            <Button variant="ghost"  size="icon"  >
                                                <Pencil className="h-4 w-4 text-blue-600" />
                                            </Button> 
                                            </Link>
                                            <Button variant="ghost" size="icon" onClick={()=> {router.push(`/post/${post.slug}`);}} >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (<TableRow  >
                                <TableCell colspan="4" className="text-center text-base text-gray-400 italic p-10">
                                <Inbox className="opacity-30" />
                                Ready to share your thoughts with the world?
                                </TableCell>
                            </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </div>

            </main>
        </>
    );
}

export default withAuth(MyPosts)
