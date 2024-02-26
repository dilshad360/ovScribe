"use client"

import NavBar from "@/components/NavBar";
import withAuth from "@/app/middleware/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import Image from "next/image";
import { Button } from "@/components/ui";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";


function ManagePosts() {



    const [posts, setPosts] = useState([]);

    const statusOptions = ["PENDING", "APPROVED", "REJECTED"]

    const router = useRouter();

    useEffect(() => {    
            fetchPosts();   
    }, [])


    const fetchPosts = async () => {
        try {
            const q = query(collection(db, "posts"));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setPosts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const changeStatusHandler = async (value, docId) => {
        try {
            const docRef = doc(db, "posts", docId);
            await updateDoc(docRef, {
                status: value,
            });
            toast.success(`Status successfully updated to ${value}`);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <NavBar />
            <main className="flex min-h-screen flex-col items-center gap-16 py-24 ">
            <h4 className="text-2xl font-semibold">All Posts</h4>
                <div className="flex shadow-md rounded-md w-11/12 md:w-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Title</TableHead>
                                <TableHead>Thumbnail</TableHead>
                                <TableHead className="w-[140px]" >Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.length > 0 &&
                                posts.map((post, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="whitespace-nowrap" > {post.title} </TableCell>
                                        <TableCell className="p-0 flex items-center justify-center">
                                            <Image className="w-12 m-2 h-8 object-cover rounded-md" src={post.thumbnailUrl} width={100} height={100} alt=" " />
                                        </TableCell>
                                        <TableCell>

                                        <Select onValueChange={(value)=>{changeStatusHandler(value, post.id)}}>
                                                <SelectTrigger className="w-fit h-6 text-xs font-semibold rounded-2xl ">
                                                    <SelectValue placeholder={post.status} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl" >
                                                    {statusOptions.map(status => (
                                                        <SelectItem className="text-xs rounded-2xl " value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                        {/* <Badge variant="outline">{post.status}</Badge> */}
                                        </TableCell>
                                        <TableCell className="p-0 ">
                                            {/* <Button variant="ghost" size="icon" onClick={()=> deletePost(post.id)} >
                                                <Trash className="h-4 w-4 text-red-600" />
                                            </Button> */}
                                            {/* <Button variant="ghost"  size="icon" disabled  >
                                                <Pencil className="h-4 w-4 " />
                                            </Button> */}
                                            <Button variant="ghost" size="icon" onClick={()=> {router.push(`/post/${post.slug}`);}} >
                                                <Eye className="h-4 w-4" />
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

export default withAuth(ManagePosts, ['admin','approver'])