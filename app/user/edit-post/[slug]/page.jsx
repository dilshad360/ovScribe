"use client";

import { db, storage } from "@/app/firebase/config";
import withAuth from "@/app/middleware/auth";
import NavBar from "@/components/NavBar";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { quillModules } from "@/utils/quillModules";
import { v4 as uuidv4 } from "uuid";

import "react-quill/dist/quill.snow.css";
import "@/styles/quillEditor.css";
import { Trash } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(
  () => {
    return import("react-quill");
  },
  { ssr: false }
); 

function Page({ params }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [changeThumbnail, setChangeThumbanil] = useState(false);

  // const [post, setPost] = useState([]);

  useEffect(() => {
    fetchPost(params.slug);
  }, []);

  const router = useRouter();

  const fetchPost = async (postId) => {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const postData = { ...docSnap.data(), id: docSnap.id };
        setPost(postData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setPost = async (post) => {
    setTitle(post.title);
    setSummary(post.summary);
    setContent(post.content);
    setThumbnailPreview(post.thumbnailUrl);
  };

  const sumbitHandler = async (docId) => {
    if (!content || !summary ) return;
    try {

      let thumbnailURL = "";
      if (thumbnail && changeThumbnail) {
          const id = uuidv4();
          const storageRef = ref(storage, `thumbnails/${id}`);
          await uploadBytes(storageRef, thumbnail);
          thumbnailURL = await getDownloadURL(storageRef);
      } else {
        thumbnailURL = thumbnailPreview;
      }


      const docRef = doc(db, "posts", docId);
      await updateDoc(docRef, {
        summary: summary,
        content: content,
        thumbnailUrl: thumbnailURL
      });
      toast.success(`Successfully updated`);
      router.push("/user/my-posts");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange = (html) => {
    setContent(html);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      console.log(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <NavBar />
      <main className="flex min-h-screen flex-row justify-center items-center  py-10 ">
        <div className="w-[90%] md:w-[40%]">
          <h2 className="text-3xl font-bold mb-10">Edit post</h2>
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
              value={title}
              disabled
              onChange={(e) => {
                // setTitle(e.target.value);
              }}
            ></Input>

            <Label>Thumbnail</Label>

            <Input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={!changeThumbnail}
            />

            {thumbnailPreview && (
              <div className="flex gap-2 items-center">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="rounded-md min-w-40  h-24 object-cover"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
                />
                <Button variant="ghost" size="icon" onClick={()=>{
                  setChangeThumbanil(true);
                setThumbnailPreview("");
                }}>
                <Trash className="h-4 w-4 text-red-600"/>
                </Button>
                </div>
            )}
            <p className="text-sm text-muted-foreground pb-3">
              Please upload an image with a 16:9 aspect ratio
            </p>

            <Label>Summary</Label>

            <Textarea
              required
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
              }}
              maxLength="150"
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

            <Button
              className=""
              type="submit"
              onClick={() => {
                sumbitHandler(params.slug);
              }}
            >
              Save changes
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default withAuth(Page);
