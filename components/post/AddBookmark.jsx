import { useAuth } from "@/app/firebase/auth";
import { db } from "@/app/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { BookmarkCheck, BookmarkPlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui";

function AddBookmark({ post }) {
  const [bookmarked, setBookmarked] = useState(false);

  const { authUser } = useAuth();

  useEffect(() => {
    checkAlreadyBookmarked(post);
  }, []);

  const sumbitBookmark = async (item) => {
    try {
      const docRef = await addDoc(collection(db, "bookmarks"), {
        owner: authUser.uid,
        postId: item.id,
        title: item.title,
        slug: item.slug,
      });
      toast.success("Bookmark added successfully");
      setBookmarked(true)
    } catch (error) {
      console.error(error);
    }
  };

  const checkAlreadyBookmarked = async (item) => {
    try {
      const q = query(
        collection(db, "bookmarks"),
        where("owner", "==", authUser.uid),
        where("postId", "==", item.id)
      );
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      if(data.length > 0) {
        setBookmarked(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {bookmarked ? (
        <BookmarkCheck className="w-6 fill-teal-300 text-teal-500" />
      ) : (
        <BookmarkPlus
          onClick={() => {
            sumbitBookmark(post);
          }}
          className="w-6 cursor-pointer hover:fill-current"
        />
      )}
    </div>
  );
}

export default AddBookmark;
