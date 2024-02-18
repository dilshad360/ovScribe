'use client'
// authMiddleware.js
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../firebase/auth";
import Loader from "@/components/loader";

const withAuth = (WrappedComponent,  allowedRoles) => {
    const Auth = (props) => {
        const { authUser, isloading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!isloading && (!authUser|| !allowedRoles.includes(authUser.role))) {
                router.push("/");
            }
        }, [authUser, isloading])


        // return (
        //     <WrappedComponent {...props} />
        // )


        return isloading || (!isloading && (!authUser || !allowedRoles.includes(authUser.role))) ? (
            <Loader />
        ) : (
            <WrappedComponent {...props} />
        )
    };

    return Auth;
};

export default withAuth;
