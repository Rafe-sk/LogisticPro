import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Home from "./pages/Home.jsx"
import ProfileSetup from "./pages/ProfileSetup.jsx"
import Profile from "./pages/Profile.jsx"
import Navigation from "./components/Navigation.jsx"
import CreateOrder from "./pages/CreateOrder.jsx"
import CreateParcel from "./pages/CreateParcel.jsx"
import Payment from "./pages/Payment.jsx"
import Orders from "./pages/Orders.jsx"


function App() {
  

  return (
    <>

      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} /> 
        <Route path="/home" element={(
          <>
          <Navigation/>
          <Home/>
          </>
        )}/>
        <Route path="/register" element={<Register/>} />
        <Route path="/profileSetup" element={<ProfileSetup/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/createOrder" element={<CreateOrder/>}/>
        <Route path="/parcel" element={<CreateParcel/>}/>
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/orders" element={<Orders/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
