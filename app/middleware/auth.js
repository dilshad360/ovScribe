'use client'
// authMiddleware.js
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../firebase/auth";
import Loader from "@/components/loader";

const withAuth = (WrappedComponent) => {
    const Auth = (props) => {
        const { authUser, isloading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isloading && !authUser) {
                router.push("/");
            }
        }, [authUser, isloading])


        return isloading || (!isloading && !authUser) ? (
            <Loader />
        ) : (
            <WrappedComponent {...props} />
        )
    };

    return Auth;
};

export default withAuth;
