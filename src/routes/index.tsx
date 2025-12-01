import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const Welcome = lazy(() => import("../pages/Welcome"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignUp")); 
const Dashboard = lazy(() => import("../pages/Dashboard"));

export default function Router() {
  return (
    <BrowserRouter>
      {/* Suspense shows a loading text while the code chunk is being downloaded */}
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Application...</div>}>
        <Routes>
          
          {/* --- PUBLIC ROUTES --- */}
          
          {/* Root path loads the Welcome page */}
          <Route path="/" element={<Welcome />} />
          
          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* --- FALLBACK ROUTE --- */}
          {/* If user types a random URL, redirect them back to Welcome */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}