import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);

      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (err) {
      console.log(err);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/posts/${id}`, {
        title,
        content,
      });

      alert("Post Updated ✅");

      navigate(`/post/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      onSubmit={updatePost}
      className="max-w-3xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-4">
        Edit Post
      </h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border w-full p-2 mb-3 rounded"
      />

      <textarea
        rows="8"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border w-full p-2 rounded"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Update Post
      </button>
    </form>
  );
}