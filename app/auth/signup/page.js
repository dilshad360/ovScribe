"use client";

import { Input, Button, Label } from "@/components/ui";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebase/config";
import { useAuth } from "../../firebase/auth";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner"
import writeImage from "@/components/assets/writing.png";
import { doc, setDoc } from "firebase/firestore";



export default function Signup() {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const { authUser, isloading, setAuthUser } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!isloading && authUser) {
            router.push("/");
        }
    }, [authUser, isloading]);

    const signupHandler = async () => {
        if ( password !== confirmPassword) {
            toast.warning('Password does not match')
            return;
        }
        if (!username || !email || !password) return;
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(auth.currentUser, {
                displayName: username,
            });

            await setDoc(doc(db, "users", user.uid),{
            uid: user.uid,
            email: user.email,
            username: username,
            phoneNumber: phoneNumber,
            role: "user"
            })

            setAuthUser({
                uid: user.uid,
                email: user.email,
                username,
                phoneNumber: phoneNumber,
                role: "user"
            });

        } catch (error) {
            console.log("error found", error)
            const message = JSON.parse(JSON.stringify(error))
            toast.error(message.code.replace(/^auth\//, "").replace(/-/g, " "))
        }
    };

    return  isloading || (!isloading && authUser) ? (
        <Loader />
    ) : (
        <main className="flex min-h-screen flex-row justify-center items-center py-24">
            <Image className="hidden md:flex" src={writeImage}  width={360} alt="write image" />
            <div className="w-[80%] md:w-1/3">
                <h2 className="text-6xl font-bold mb-10">Sign up</h2>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Label>Username</Label>
                    <Input
                        type="text"
                        required
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    ></Input>
                        <Label>Phone Number</Label>
                    <Input
                        type="tel"
                        required
                        maxlength="10"
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                        }}
                    ></Input>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        required
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    ></Input>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        required
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    ></Input>
                     <Label>Confirm Password</Label>
                    <Input
                        type="password"
                        required
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                    ></Input>
                    <Button className="mt-2" type="submit" onClick={signupHandler}>
                        Sign up
                    </Button>
                </form>
            </div>
        </main>
    );
}
