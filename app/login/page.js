"use client"

import { Button, Input, Label } from "@/components/ui";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase/config";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "../firebase/auth";
import { toast } from "sonner"


export default function Login() {

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const { authUser, isloading } = useAuth();

    const router = useRouter();


    useEffect(()=>{
        if(!isloading && authUser) {
            router.push("/");
        }
    },[authUser, isloading])


    const loginHandler = async()=>{
        if(!email || !password) return;
        try {
            const user = await signInWithEmailAndPassword(auth, email, password )
        } catch (error) {
            console.log("error found", error)
            const message = JSON.parse(JSON.stringify(error))
            toast.error(message.code.replace(/^auth\//, "").replace(/-/g, " "))
        }
        }


    return isloading || (!isloading && authUser) ? (<Loader/>) :  (
    <main className="flex min-h-screen flex-col items-center gap-16 py-24 ">
            {/* <Loader/> */}
            <div className="w-[30%]">
            <h2 className="text-3xl font-bold mb-10">Login in</h2>
            <form className="flex flex-col gap-3" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <Label>Email</Label>
                <Input placeholder="Enter your email" type="email" required onChange={(e) => {
                    setEmail(e.target.value);
                }} ></Input>
                <Label>Password</Label>
                <Input placeholder="Enter your password" type="password" required onChange={(e)=>{
                    setPassword(e.target.value);
                }} ></Input>
                <Button className="mt-2" type="submit" onClick={loginHandler}  >Log in</Button>
            </form>
            </div>
        </main>
    );
}
