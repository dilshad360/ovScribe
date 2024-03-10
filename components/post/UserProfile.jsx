"use client";

import { db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserProfile = ({ userId }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        fetchUserProfile(userId);
    }, []);

    const fetchUserProfile = async (userId) => {
        try {
            const docRef = doc(db, "users", userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = { ...docSnap.data(), id: docSnap.id };
                setUserData(userData);
                console.log(userData);
            } else {
                console.log("No such user!");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {userData && (
                <div className="flex gap-1 items-center pb-2">
                    <Avatar>
                        <AvatarImage src={userData.profileImage} />
                        <AvatarFallback className="bg-white border font-semibold">
                            {userData.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                        
                    </Avatar>
                    <h4 className="font-semibold">{userData.username}</h4>
                </div>
            )}
        </>
    );
};

export default UserProfile;
