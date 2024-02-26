"use client"

import { Button, Input, Label } from "@/components/ui";
import { sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import { useAuth } from "../../firebase/auth";
import { toast } from "sonner"
import badImage from "@/components/assets/bad-day.png"
import Image from "next/image";


export default function ForgotPassword() {

    const [email, setEmail] = useState(null);

    const { authUser, isloading } = useAuth();

    const router = useRouter();


    useEffect(()=>{
        if(!isloading && authUser) {
            router.push("/");
        }
    },[authUser, isloading])


    const resetHandler = async () => {
        if(!email) return;
        sendPasswordResetEmail(auth, email).then(data => {
            toast.success('Password reset link sent to your email.',{duration: 4000})
            router.push('/auth/login')
        }).catch(error => {
            const message = JSON.parse(JSON.stringify(error))
            toast.error(message.code.replace(/^auth\//, "").replace(/-/g, " "))
        })
    }


    return isloading || (!isloading && authUser) ? (<Loader/>) :  (
    <main className="flex min-h-screen flex-col items-center gap-16 py-24 ">
            <div className="w-[90%] md:w-[30%]">
            <div className="">
            <Image className="hidden md:flex" src={badImage}  width={300} alt="write image" />
            <h2 className="text-4xl font-bold mb-10">Reset your password</h2>   
            </div>
            <form className="flex flex-col gap-3" onSubmit={(e) => {
                e.preventDefault();
            }}>
                <Label>Email</Label>
                <Input  type="email" required onChange={(e) => {
                    setEmail(e.target.value);
                }} ></Input>
                <Button className="mt-2" type="submit" onClick={resetHandler}>Reset</Button>
            </form>
            </div>
        </main>
    );
}
