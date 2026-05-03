import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root/Root";
import { Login } from "./components/Login/Login";
import { Signup } from "./components/Signup/Signup";
import { Home } from "./components/Home/Home";
import { Communities } from "./components/Communities/Communities";
import { CommunityDetail } from "./components/CommunityDetail/CommunityDetail";
import { AdminPanel } from "./components/AdminPanel/AdminPanel";
import { Search } from "./components/Search/Search";
import { Profile } from "./components/Profile/Profile";
import { Settings } from "./components/Settings/Settings";
import { Help } from "./components/Help/Help";
import { NotFound } from "./components/NotFound/NotFound";
import { MyPosts } from "./components/MyPosts/MyPosts";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { Unauthorized } from "./components/Unauthorized/Unauthorized";
import { CreateCommunity } from "./components/CreateCommunity/CreateCommunity";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { path: "login", Component: Login },
      { path: "signup", Component: Signup },
      { path: "unauthorized", Component: Unauthorized },
      { index: true, Component: Home },
      { path: "communities", Component: Communities },
      { path: "community/:id", Component: CommunityDetail },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      { path: "search", Component: Search },
      { path: "profile", Component: Profile },
      { path: "my-posts", Component: MyPosts },
      { path: "create-community", Component: CreateCommunity },
      { path: "settings", Component: Settings },
      { path: "help", Component: Help },
      { path: "*", Component: NotFound },
    ],
  },
]);
