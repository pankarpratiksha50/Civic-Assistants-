import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import api from "./api";
import ReportForm from "./pages/ReportForm";
import MapPage from "./pages/MapPage";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthPage({ mode }) {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const nav = useNavigate();
  const submit = async e => {
    e.preventDefault(); setError("");
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem("civic_token", data.token);
      localStorage.setItem("civic_user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch (err) { setError(err.response?.data?.message || "Please try again."); }
  };
  return <main className="auth-wrap"><form className="panel auth" onSubmit={submit}>
    <div className="brand-mark">CA</div><h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
    <p className="muted">Civic Assistants · Safer roads, stronger communities</p>
    {mode === "register" && <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>}
    <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
    {error && <p className="error">{error}</p>}<button className="primary full">{mode === "login" ? "Login" : "Register"}</button>
    <p className="muted center">{mode === "login" ? "New here?" : "Already have an account?"} <Link to={mode === "login" ? "/register" : "/login"}>{mode === "login" ? "Create account" : "Login"}</Link></p>
  </form></main>;
}
function Layout({ children }) {
  const { user, logout } = useAuth();
  return <><header className="topbar"><Link className="logo" to="/"> <span>CA</span> Civic Assistants</Link><nav><Link to="/">Map</Link><Link to="/report">Report pothole</Link><Link to="/assistant">Civic AI</Link>{user?.role==="admin" && <Link to="/dashboard">Municipal dashboard</Link>}</nav><div className="user-nav"><span>{user?.name}</span><button className="ghost" onClick={logout}>Logout</button></div></header><main className="container">{children}</main><footer>Built for safer, more accessible roads · Civic Assistants</footer></>;
}
export default function App() {
  const [user,setUser] = useState(()=>{try{return JSON.parse(localStorage.getItem("civic_user"))}catch{return null}});
  const logout=()=>{localStorage.removeItem("civic_token");localStorage.removeItem("civic_user");setUser(null);};
  useEffect(()=>{ if(localStorage.getItem("civic_token")) api.get("/auth/me").then(({data})=>{setUser(data.user);localStorage.setItem("civic_user",JSON.stringify(data.user));}).catch(logout); },[]);
  const auth={user,setUser,logout};
  const Private=({children,admin=false})=>!user?<Navigate to="/login"/>:admin&&user.role!=="admin"?<Navigate to="/"/>:children;
  return <AuthContext.Provider value={auth}><Routes>
    <Route path="/login" element={user?<Navigate to="/"/>:<AuthPage mode="login"/>}/><Route path="/register" element={user?<Navigate to="/"/>:<AuthPage mode="register"/>}/>
    <Route path="/*" element={<Private><Layout><Routes>
      <Route path="/" element={<MapPage/>}/><Route path="/report" element={<ReportForm/>}/><Route path="/assistant" element={<ChatPage/>}/>
      <Route path="/dashboard" element={<Private admin><Dashboard/></Private>}/>
      <Route path="*" element={<div className="panel"><h2>Page not found</h2><Link to="/">Go to map</Link></div>}/>
    </Routes></Layout></Private>}/>
  </Routes></AuthContext.Provider>;
}
