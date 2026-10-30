import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import api, { imageUrl } from "../api";
const markerIcon = L.divIcon({className:"custom-pin",html:"<span></span>",iconSize:[22,22],iconAnchor:[11,11]});
export default function MapPage(){
  const [reports,setReports]=useState([]),[error,setError]=useState("");
  useEffect(()=>{api.get("/reports/map/public").then(({data})=>setReports(data.reports)).catch(()=>setError("Could not load map reports."));},[]);
  const center=reports.length?[reports[0].location.coordinates[1],reports[0].location.coordinates[0]]:[18.5204,73.8567];
  return <><section className="hero"><div><p className="eyebrow">SMART CITY · COMMUNITY REPORTING</p><h1>Make every road<br/><span>safer for everyone.</span></h1><p>Report potholes, share their exact location, and help municipal teams prioritize repairs.</p><a className="button primary" href="/report">+ Report a pothole</a></div><div className="hero-stat"><strong>{reports.length}</strong><span>active reported hazards</span><small>Live reports from the community</small></div></section>
    <div className="section-title"><div><h2>Reported road hazards</h2><p className="muted">Map pins show unresolved reports. Select a pin for details.</p></div><span className="pill">● Live map</span></div>
    {error&&<p className="error">{error}</p>}
    <div className="map-frame"><MapContainer center={center} zoom={12} scrollWheelZoom style={{height:"100%",width:"100%"}}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{reports.map(r=><Marker key={r._id} position={[r.location.coordinates[1],r.location.coordinates[0]]} icon={markerIcon}><Popup><b>{r.title}</b><br/>{r.address}<br/>Status: {r.status}<br/>Severity: {r.severity}<br/><img src={imageUrl(r.imageUrl)} style={{width:150,marginTop:8}}/></Popup></Marker>)}</MapContainer></div>
    <div className="report-grid">{reports.slice(0,6).map(r=><article className="panel report-card" key={r._id}><img src={imageUrl(r.imageUrl)} alt="Reported road hazard"/><div><span className={`status ${r.status.replace(" ","-").toLowerCase()}`}>{r.status}</span><h3>{r.title}</h3><p className="muted">{r.address}</p><small>{new Date(r.createdAt).toLocaleString()}</small></div></article>)}</div>
  </>;
}
