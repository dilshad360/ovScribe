'use client'


import { useAuth } from '@/app/firebase/auth'
import { db } from '@/app/firebase/config'
import withAuth from '@/app/middleware/auth'
import NavBar from '@/components/NavBar'
import { Button } from '@/components/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { BookmarkX, Inbox } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'




function page() {

    const [bookmarks, setBookmarks] = useState([]);

    const router = useRouter();


    const { authUser } = useAuth();


    useEffect(() => {
        if (!!authUser) {
            fetchBookmarks(authUser.uid);
        }
    }, [authUser])
    
    
    const fetchBookmarks = async (uid) => {
        try {
            const q = query(collection(db, "bookmarks"), where("owner", "==", uid));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            setBookmarks(data);
        } catch (error) {
            console.error(error);
        }
    };


    const deleteBookmark = async (docId) => {
        try {
            await deleteDoc(doc(db, "bookmarks", docId));
            const updatedList = bookmarks.filter((item) => item.id !== docId);
            toast.success("Bookmark removed successfully")
            setBookmarks(updatedList)
        } catch (error) {
            console.error(error);
        }
    };





    return (
        <div>
            <NavBar />
            <main className="flex min-h-screen flex-col items-center   gap-16 py-24 ">
                <h4 className="text-2xl font-semibold">My Bookmarks</h4>
                <div className="flex shadow-md rounded-md w-11/12 md:w-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="">Title</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookmarks.length > 0 ? (
                                bookmarks.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="cursor-pointer" onClick={()=> {router.push(`/post/${item.slug}`)}} > {item.title} </TableCell>
                                        <TableCell className="p-0 text-center ">
                                            <Button variant="ghost" size="icon" onClick={()=> deleteBookmark(item.id)} >
                                                <BookmarkX className="h-5 w-5 text-red-600" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (<TableRow >
                                <TableCell colspan="4" className="text-center text-base text-gray-400 italic p-10">
                                <Inbox className="opacity-30" />
                                No Bookmarks yet!!
                                </TableCell>
                            </TableRow>)
                            }
                        </TableBody>
                    </Table>
                </div>

            </main>
        </div>
    )
}

export default withAuth(page)
