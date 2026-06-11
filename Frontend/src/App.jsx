import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";
import { useLocation } from "react-router-dom";
import PostDetails from "./pages/postDetails";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Register from "./pages/Register";
import EditPost from "./pages/EditPost";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit/:id" element={<EditPost />} />
      </Routes>
    </>
  );
}

export default App;