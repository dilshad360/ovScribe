"use client";

import NavBar from "@/components/NavBar";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { useEffect, useState } from "react";
import { db, storage } from "../firebase/config";
import { useAuth } from "../firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import slugify from "slugify";
import withAuth from "../middleware/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quillEditor.css";

function createPost() {
    const { authUser, isloading } = useAuth();

    const [title, setTitle] = useState(null);
    const [summary, setSummary] = useState(null);
    const [content, setContent] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const router = useRouter();

    const sumbitHander = async () => {
        if (!title && !content) return;
        try {
            // Upload image to Firebase Storage
            let thumbnailURL = "";
            if (thumbnail) {
                const storageRef = ref(storage, `thumbnails/${thumbnail.name}`);
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
            router.push("/my-posts");
        } catch (error) {
            console.error(error);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
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
        <>
            <NavBar />
            <main className="flex min-h-screen flex-row justify-center items-center  py-10 ">
                <div className="w-[40%]">
                    <h2 className="text-3xl font-bold mb-10">Create post</h2>
                    <form
                        className="flex flex-col gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <Label>Thumbnail</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                        />
                        {thumbnailPreview && (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="rounded-md"
                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                        )}
                        <p className="text-sm text-muted-foreground pb-3">
                        Please upload an image with a 16:9 aspect ratio
                        </p>
                        <Label>Title</Label>
                        <Input
                            type="text"
                            required
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                        ></Input>

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
                            className="bg-white rounded-md h-[360px] border"
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
        </>
    );
}

export default withAuth(createPost);
