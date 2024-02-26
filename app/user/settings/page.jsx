"use client"

import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { useAuth } from "../../firebase/auth";
import withAuth from "../../middleware/auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, Input, Label } from "@/components/ui";
import { Pencil, Save } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/app/firebase/config";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";



function Settings() {

    const { authUser, setAuthUser } = useAuth();

    const [username, setUsername] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)

    const [profileImage, setProfileImage] = useState(null)
    const [profilePreview, setProfilePreview] = useState(null)

    const editUserDataHandler = async (newUsername, newPhoneNumber) => {
        try {
            const docRef = doc(db, "users", authUser.uid);
            await updateDoc(docRef, {
                username: newUsername,
                phoneNumber: newPhoneNumber
            });

            setAuthUser({
                ...authUser,
                username: newUsername,
                phoneNumber: newPhoneNumber,
            });

            toast.success("Successfully Updated");
        } catch (error) {
            console.error(error);
        }
    };


    const handleProfileImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file)
            console.log(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const updateProfileImage = async () => { 
        if (!profileImage) return;

        // Upload image to Firebase Storage
        let profileURL = "";
        if (profileImage) {
            const id = uuidv4();
            const storageRef = ref(storage, `profiles/${id}`);
            await uploadBytes(storageRef, profileImage);
            profileURL = await getDownloadURL(storageRef);
        }

        try {
            const docRef = doc(db, "users", authUser.uid);
            await updateDoc(docRef, {
                profileImage: profileURL,
            });

            await setAuthUser({
                ...authUser,
                profileImage: profileURL,
            });

            setProfilePreview("")

            toast.success("Successfully Updated");
        } catch (error) {
            console.error(error);
        }


    };




    useEffect(() => {
        setUsername(authUser.username);
        setPhoneNumber(authUser.phoneNumber);
    }, [authUser])


    return (
        <>
            <NavBar />
            <main className="flex min-h-screen flex-col items-center py-24">
                <div className="w-[90%] md:w-[50%] space-y-5">
                <h3 className="text-4xl font-semibold">
                    Edit Profile
                </h3>
                <div className="flex items-center gap-6">
                    <Avatar className="w-32 h-32">
                        {profilePreview ? 
                        <AvatarImage src={profilePreview} /> :
                        <AvatarImage src={authUser.profileImage} />
                            }
                            {authUser.username && (
                        <AvatarFallback className="bg-white border font-semibold text-[50px]" >{authUser.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            ) }
                    </Avatar>
                    <div className="space-y-2">
                        <Label>Upload new picture</Label>
                        <div className="flex gap-2">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImage}
                            />
                            {profilePreview &&
                    <Button onClick={updateProfileImage} ><Save/></Button>
                            }
                            </div>
                    </div>
                </div>
                <div>
                    <div className="flex gap-3 flex-row items-end pb-4">
                        <div className="w-full">
                            <Label>Username</Label>
                            <Input
                                type="text"
                                required
                                disabled
                                value={authUser.username}
                            ></Input>
                        </div>
                        <div className="w-full">
                            <Label>Phone Number</Label>
                            <Input
                                type="text"
                                required
                                disabled
                                value={authUser.phoneNumber}
                            ></Input>
                        </div>
                        <Dialog>
                            <DialogTrigger> <Button variant="outline" ><Pencil className="scale-75 opacity-70" /></Button></DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Username & Phone Number</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">
                                            Username
                                        </Label>
                                        <Input
                                            value={username}
                                            className="col-span-3"
                                            required
                                            type="text"
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">
                                            Phone No
                                        </Label>
                                        <Input
                                            value={phoneNumber}
                                            className="col-span-3"
                                            required
                                            type="tel"
                                            maxlength="10"
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => {
                                        editUserDataHandler(username, phoneNumber)
                                    }}>Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <Separator className="mb-2" />
                    <Label>Email</Label>
                    <Input
                        type="text"
                        required
                        disabled
                        value={authUser.email}
                    ></Input>
                </div>
                </div>
            </main>
        </>
    );
}

export default withAuth(Settings)
