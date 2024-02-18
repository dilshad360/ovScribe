'use client'

const { createContext, useContext, useState, useEffect } = require("react");
import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth, db } from "./config";
import { doc, getDoc } from "firebase/firestore";

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

        const userDoc = await getDoc(doc(db, "users", user.uid));

        // setAuthUser({
        //     uid: user.uid,
        //     email: user.email,
        //     username: user.displayName,
        //     phoneNumber: userDoc.data().phoneNumber,
        //     role: userDoc.data().role
        // });


        if (userDoc.exists()) {
            setAuthUser({
                uid: user.uid,
                email: user.email,
                username: user.displayName,
                phoneNumber: userDoc.data().phoneNumber,
                role: userDoc.data().role
            });
        } else {
            // Handle the case when user data doesn't exist
            console.error("User data not found");
        }

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
