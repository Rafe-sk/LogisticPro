import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import ProfileSetup from "./pages/ProfileSetup.jsx"
import Profile from "./pages/Profile.jsx"
import Navigation from "./components/Navigation.jsx"
import Pickup from "./pages/Pickup.jsx"
import Delivery from "./pages/Delivery.jsx"
import CreateParcel from "./pages/CreateParcel.jsx"
import Payment from "./pages/Payment.jsx"
import Orders from "./pages/Orders.jsx"
import TrackingResults from "./pages/TrackingResults.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"
import ResetPassword from "./pages/ResetPassword.jsx"

// Layout wrapper: renders navbar above any page
function WithNav({ children }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes (no auth required) ─────────────────────── */}
        {/* Landing/Home is now the default route */}
        <Route path="/"           element={<WithNav><Home /></WithNav>} />
        <Route path="/home"       element={<WithNav><Home /></WithNav>} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/profileSetup" element={<ProfileSetup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ── Protected routes (require login) ─────────────────────── */}
        <Route path="/profile"    element={<WithNav><Profile /></WithNav>} />
        <Route path="/orders"     element={<WithNav><Orders /></WithNav>} />

        {/* 4-step order wizard */}
        <Route path="/pickup"     element={<WithNav><Pickup /></WithNav>} />
        <Route path="/delivery"   element={<WithNav><Delivery /></WithNav>} />
        <Route path="/parcel"     element={<WithNav><CreateParcel /></WithNav>} />
        <Route path="/payment"    element={<WithNav><Payment /></WithNav>} />
        <Route path="/tracking"   element={<WithNav><TrackingResults /></WithNav>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
