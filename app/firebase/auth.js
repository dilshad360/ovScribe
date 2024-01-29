'use client'

const { createContext, useContext, useState, useEffect } = require("react");
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./config";

const AuthUserContext = createContext({
    authUser: null,
    isloading: true,
});


export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isloading, setIsLoading] = useState(true);

    const clear = () => {
        setAuthUser(null);
        setIsLoading(false);
    };

    const authStateChanged = async (user) => {
        setIsLoading(true);
        if (!user) {
            clear();
            return;
        }
        setAuthUser({
            uid: user.uid,
            email: user.email,
            username: user.displayName,
        });
        setIsLoading(false);
    };

    const signOut = () => {
        authSignOut(auth).then(() => clear());
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return () => unsubscribe();
    }, []);

    return {
        authUser, isloading, setAuthUser, signOut
    }

}

export const AuthUserProvider = ({ children }) => {

    const auth = useFirebaseAuth()

    return (
        <AuthUserContext.Provider value={auth}>{children}</AuthUserContext.Provider>
    );
};

export const useAuth = () => useContext(AuthUserContext);
