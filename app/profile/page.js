"use client"

import NavBar from "@/components/NavBar";
import withAuth from "../middleware/auth";

function Profile() {


    return (
        <>
        <NavBar/>
    <main className="flex min-h-screen flex-col items-center gap-16 py-24 ">
        profile page 
        </main>
        </>

    );
}

export default withAuth(Profile)