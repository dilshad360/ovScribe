"use client";

import { Input, Button, Label } from "@/components/ui";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../firebase/auth";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const { authUser, isLoading, setAuthUser } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!isLoading && authUser) {
            router.push("/");
        }
    }, [authUser, isLoading]);

    const signupHandler = async () => {
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
            setAuthUser({
                uid: user.uid,
                email: user.email,
                username,
            });
            console.log(user)
        } catch (err) {
            console.log("error found", err);
        }
    };

    return  isLoading || (!isLoading && authUser) ? (
        <Loader />
    ) : (
        <main className="flex min-h-screen flex-col items-center gap-16 py-24 ">
            <div className="w-[30%]">
                <h2 className="text-3xl font-bold mb-10">Sign up</h2>
                <form
                    className="flex flex-col gap-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <Label>Username</Label>
                    <Input
                        placeholder="Enter your username"
                        type="text"
                        required
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    ></Input>
                    <Label>Email</Label>
                    <Input
                        placeholder="Enter your email"
                        type="email"
                        required
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    ></Input>
                    <Label>Password</Label>
                    <Input
                        placeholder="Enter your password"
                        type="password"
                        required
                        onChange={(e) => {
                            setPassword(e.target.value);
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
