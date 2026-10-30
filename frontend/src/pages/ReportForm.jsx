import React, { useRef, useState } from "react";
import api from "../api";
export default function ReportForm(){
  const [file,setFile]=useState(null),[coords,setCoords]=useState(null),[address,setAddress]=useState(""),[description,setDescription]=useState(""),[severity,setSeverity]=useState("medium"),[message,setMessage]=useState(""),[busy,setBusy]=useState(false);
  const camera=useRef();
  const getLocation=()=>{setMessage("Getting your device location…"); if(!navigator.geolocation){setMessage("Geolocation is not supported by this browser.");return;}
    navigator.geolocation.getCurrentPosition(p=>{setCoords({latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy});setMessage(`Location captured (about ${Math.round(p.coords.accuracy)} m accuracy).`);},
    e=>setMessage(e.message),{enableHighAccuracy:true,timeout:15000,maximumAge:0});};
  const submit=async e=>{e.preventDefault();if(!file||!coords){setMessage("Please add an image and capture GPS location.");return;}
    setBusy(true);setMessage("");
    try{const fd=new FormData();fd.append("image",file);fd.append("latitude",coords.latitude);fd.append("longitude",coords.longitude);fd.append("address",address);fd.append("description",description);fd.append("severity",severity);
      const {data}=await api.post("/reports",fd,{headers:{"Content-Type":"multipart/form-data"}});
      setMessage(`Report submitted successfully. AI detection: ${data.report.detection.label}`);setFile(null);setDescription("");
    }catch(err){setMessage(err.response?.data?.message||"Could not submit report.");}finally{setBusy(false);}
  };
  return <div className="narrow"><div className="page-heading"><p className="eyebrow">CITIZEN REPORT</p><h1>Report a pothole</h1><p className="muted">Upload a clear image and capture your current GPS location.</p></div>
    <form className="panel form-grid" onSubmit={submit}>
      <label>Road image <input ref={camera} type="file" accept="image/*" capture="environment" onChange={e=>setFile(e.target.files[0])} required/></label>
      {file&&<img className="preview" src={URL.createObjectURL(file)} alt="Selected road"/>}
      <button type="button" className="secondary" onClick={getLocation}>◎ Capture my GPS location</button>
      {coords&&<div className="location-box"><b>Location captured</b><br/>Lat: {coords.latitude.toFixed(6)} · Lng: {coords.longitude.toFixed(6)}<br/><small>Accuracy: ±{Math.round(coords.accuracy)} m</small></div>}
      <label>Address / nearby landmark (optional)<input value={address} onChange={e=>setAddress(e.target.value)} placeholder="e.g. Near college gate, Pune"/></label>
      <label>Severity<select value={severity} onChange={e=>setSeverity(e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
      <label>Description<textarea rows="4" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the pothole or road condition…"/></label>
      <button className="primary" disabled={busy}>{busy?"Submitting…":"Submit pothole report"}</button>
      {message&&<p className="notice">{message}</p>}
      <small className="muted">For safety, take photos only from a safe place. Your browser must be allowed to access location.</small>
    </form></div>;
}
