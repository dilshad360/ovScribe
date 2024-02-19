"use client";

import NavBar from "@/components/NavBar";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/config";
import { useAuth } from "../../firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import withAuth from "../../middleware/auth";
import ReactQuill from "react-quill";
import { fetchImages } from "@/utils/lexica";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid';

import "react-quill/dist/quill.snow.css";
import "./quillEditor.css";
import { Sparkles, X } from "lucide-react";

function createPost() {
    const { authUser, isloading } = useAuth();

    const [title, setTitle] = useState(null);
    const [summary, setSummary] = useState(null);
    const [content, setContent] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [openAiImage, setOpenAiImage] = useState(false);
    const [aiImageQuery, setAiImageQuery] = useState("");
    const [imageResult, setImageResult] = useState();

    const router = useRouter();

    const sumbitHander = async () => {
        if (!title && !content) return;
        try {
            // Upload image to Firebase Storage
            let thumbnailURL = "";
            if (thumbnail) {
                const id = uuidv4();
                const storageRef = ref(storage, `thumbnails/${id}`);
                await uploadBytes(storageRef, thumbnail);
                thumbnailURL = await getDownloadURL(storageRef);
            }

            // Generate slug from title
            const slug = slugify(title, {
                lower: true, // Convert to lowercase
                strict: true, // Remove special characters
            });

            const docRef = await addDoc(collection(db, "posts"), {
                owner: authUser.uid,
                title: title,
                slug: slug,
                content: content,
                summary: summary,
                status: "PENDING",
                thumbnailUrl: thumbnailURL,
                createdAt: serverTimestamp(),
            });
            toast.success("Successfully submitted");
            router.push("/user/my-posts");
        } catch (error) {
            console.error(error);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            console.log(file)
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };


    const handleAiImage = async (imageUrl) => {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        setThumbnail(blob);
        setThumbnailPreview(URL.createObjectURL(blob));
        setOpenAiImage(false);
    };


    const handleAiImageSearch = async () => {
        const data = await fetchImages(aiImageQuery);
        setImageResult(data);
    };

    const handleEditorChange = (html) => {
        setContent(html);
    };

    const quillModules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["clean"],
        ],
        clipboard: {
            matchVisual: false,
        },
    };



    return (
        <div>
            <NavBar />

            {/* Ai Search  */}

            {openAiImage && (
                <div className="backdrop-blur-sm bg-black/40  fixed top-0 w-full h-full flex justify-center items-center z-10">
                    <div className="bg-white  shadow-md rounded-md px-5 py-6 text-center w-[740px]">
                        <div className="flex justify-between pb-2" >
                            <h3 className="text-2xl font-semibold" >Generate AI Image</h3>
                            <Button
                                onClick={() => {
                                    setOpenAiImage(false);
                                }}
                                variant="ghost"
                            >
                                <X/>
                            </Button>
                        </div>
                        <div className="flex gap-2 py-2">
                            <Input placeholder="Enter the image query" value={aiImageQuery} onChange={(e) => {
                                setAiImageQuery(e.target.value)
                            }} ></Input>
                            <Button
                                onClick={() => {
                                    handleAiImageSearch();
                                }}
                            >
                                Generate <Sparkles className="ml-1 w-4 text-white" />
                            </Button>
                            
                        </div>

                        <div className="flex flex-wrap items-center gap-2 h-[20rem]  overflow-y-scroll">
                            {imageResult &&
                                imageResult.map((item, index) => (
                                    <div key={index} className="hover:scale-105 transition-all ease-in-out" onClick={() => {
                                        handleAiImage(item.src)
                                    }} >
                                        <Image src={item.srcSmall} className="min-w-40  h-24 object-cover rounded-md  " width={130} height={100}></Image>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}

              {/* Ai Search  */}


            <main className="flex min-h-screen flex-row justify-center items-center  py-10 ">
                <div className="w-[40%]">
                    <h2 className="text-3xl font-bold mb-10">Create post</h2>
                    <form
                        className="flex flex-col gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >

                        <Label>Title</Label>
                        <Input
                            type="text"
                            required
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setAiImageQuery(e.target.value)
                            }}
                        ></Input>


                        <Label>Thumbnail</Label>
                        <div className="flex">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            />

                            <span className="px-2 text-sm text-muted-foreground ">or</span>

        <Button
                onClick={(e) => {
                    e.preventDefault();
                    setOpenAiImage(true);
                }}
                variant="outline"
            >
                Generate AI Image <Sparkles className="ml-1 w-4" />
            </Button>
                        
                        </div>

                        {thumbnailPreview && (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="rounded-md min-w-40  h-24 object-cover"
                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                        )}
                        <p className="text-sm text-muted-foreground pb-3">
                            Please upload an image with a 16:9 aspect ratio
                        </p>


                        <Label>Summary</Label>

                        <Textarea
                            required
                            onChange={(e) => {
                                setSummary(e.target.value);
                            }}
                            maxlength="150"
                        />

                        <p className="text-sm text-muted-foreground pb-3">
                            Please condense the summary to under 150 characters
                        </p>

                        <Label>Content</Label>

                        <ReactQuill
                            className="bg-white rounded-md  border"
                            theme="snow"
                            value={content}
                            onChange={handleEditorChange}
                            modules={quillModules}
                            rows="10"
                        />

                        <Button className="" type="submit" onClick={sumbitHander}>
                            Submit
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default withAuth(createPost);
