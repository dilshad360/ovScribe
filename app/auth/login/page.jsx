"use client"

import { Button, Input, Label } from "@/components/ui";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "../../firebase/auth";
import { toast } from "sonner"
import fastImage from "@/components/assets/fast.png"
import Image from "next/image";
import Link from "next/link";

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
            <div className="w-[90%] md:w-[30%]">
            <div className="flex justify-center items-end w-100">
            <h2 className="text-6xl font-bold mb-10">Login</h2>   
            <Image className="hidden md:flex" src={fastImage}  width={300} alt="write image" />
            </div>
            <form className="flex flex-col gap-3" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <Label>Email</Label>
                <Input  type="email" required onChange={(e) => {
                    setEmail(e.target.value);
                }} ></Input>
                <Label>Password</Label>
                <Input  type="password" required onChange={(e)=>{
                    setPassword(e.target.value);
                }} ></Input>
                <div className="flex justify-end text-sm text-gray-600 hover:text-gray-800">
                    <Link href="/auth/forgot-password">Forgot password?</Link>
                </div>
                <Button className="mt-2" type="submit" onClick={loginHandler}  >Log in</Button>
            </form>
            </div>
        </main>
    );
}
