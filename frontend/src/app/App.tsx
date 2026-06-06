import { RouterProvider } from "react-router"
import { routes } from "./app.routes"
import { useAuth } from "../features/auth/hook/auth.hook"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import GlobalLoader from "../features/shared/components/GlobalLoader";
import { Toaster } from "react-hot-toast";

const App = () => {

  const { handleGetMe } = useAuth();
  const loading = useSelector((state: any) => state.auth.loading);

  useEffect(() => {
    console.log("handleGetMe called");
    handleGetMe();
  }, [])

  return (
    <>
      <RouterProvider router={routes} />
      {loading && <GlobalLoader />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d0d0d",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      />
    </>
  )
}

export default App