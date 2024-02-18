"use client";

import NavBar from "@/components/NavBar";
import withAuth from "@/app/middleware/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";



function ManageUsers() {

    const { authUser } = useAuth();
    const [users, setUsers] = useState([])

    const roles = ["user", "approver", "admin",]

    useEffect(() => {
        if (!!authUser) {
            fetchUsers()
        }
    }, [authUser])

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users"));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach((doc) => {
                data.push({ ...doc.data(), id: doc.id });
            });
            console.log(data)
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const changeRoleHandler = async (value, userId) => {
        try {
            const docRef = doc(db, "users", userId);
            await updateDoc(docRef, {
                role: value,
            });
            toast.success(`Role successfully changed to ${value.toUpperCase()}`);
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <>
            <NavBar />
            <main className="flex min-h-screen flex-col items-center   gap-16 py-24 ">
                <h4 className="text-2xl font-semibold">All Users</h4>
                <div className="flex shadow-md rounded-md w-1/2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead  className="w-[150px]" >Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length > 0 &&
                                users.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="flex items-center gap-2 ">
                                            <Avatar>
                                                <AvatarImage src="" />
                                                <AvatarFallback className="bg-white border font-semibold" >{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <b>{user.username}</b>
                                        </TableCell>
                                        <TableCell> {user.email} </TableCell>
                                        <TableCell> {user.phoneNumber} </TableCell>
                                        <TableCell>
                                            <Select onValueChange={(value)=>{changeRoleHandler(value, user.id)}}   >
                                                <SelectTrigger className="w-fit h-6 text-xs font-semibold rounded-2xl">
                                                    <SelectValue placeholder={user.role.toUpperCase()} />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl" >
                                                    {roles.map(role => (
                                                        <SelectItem className="text-xs rounded-2xl" value={role}>{role.toUpperCase()}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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

export default withAuth(ManageUsers, ['admin']);
