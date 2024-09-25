import ReactDOM from "react-dom/client";
import "./global.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Root } from "./routes/root";
import ErrorPage from "./error-page";
import { Home } from "./routes/home";
import { Header } from "./components/header";
import { AuthProvider } from "./contexts/auth-context";
import { ProtectedRoute } from "./components/protected-route";
import { GamePage } from "./routes/game";
import { Toaster } from "./components/ui/toaster";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/game",
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);

console.log('just to run')
ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <div className="bg-slate-900 min-h-screen p-4">
      <div className="max-w-[1440px]  mx-auto">
        <Header />
        <div className="bg-white rounded-b-lg overflow-hidden">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
    <Toaster />
  </AuthProvider>
);
