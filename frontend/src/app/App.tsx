import { RouterProvider } from "react-router"
import { routes } from "./app.routes"
import { useAuth } from "../features/auth/hook/auth.hook"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import GlobalLoader from "../features/shared/components/GlobalLoader";

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
    </>
  )
}

export default App