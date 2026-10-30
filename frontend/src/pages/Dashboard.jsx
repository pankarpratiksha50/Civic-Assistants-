import React, { useEffect, useState } from "react";
import api, { imageUrl } from "../api";
export default function Dashboard(){
 const [reports,setReports]=useState([]),[stats,setStats]=useState({total:0,reported:0,progress:0,resolved:0}),[error,setError]=useState("");
 const load=()=>Promise.all([api.get("/reports"),api.get("/reports/admin/stats")]).then(([a,b])=>{setReports(a.data.reports);setStats(b.data)}).catch(e=>setError(e.response?.data?.message||"Could not load dashboard."));
 useEffect(()=>{load()},[]);
 const update=async(id,status)=>{try{await api.patch(`/reports/${id}/status`,{status});load()}catch(e){setError("Could not update status.")}};
 return <><div className="page-heading"><p className="eyebrow">MUNICIPAL CONTROL CENTER</p><h1>Road issue dashboard</h1><p className="muted">Review citizen reports and coordinate repair progress.</p></div>
 {error&&<p className="error">{error}</p>}<div className="stats">{[["Total reports",stats.total],["Reported",stats.reported],["In progress",stats.progress],["Resolved",stats.resolved]].map(([label,val])=><div className="panel stat" key={label}><span>{label}</span><strong>{val}</strong></div>)}</div>
 <div className="section-title"><h2>All reports</h2><button className="secondary" onClick={load}>Refresh</button></div>
 <div className="panel table-wrap"><table><thead><tr><th>Image / issue</th><th>Location</th><th>AI result</th><th>Status</th><th>Update</th></tr></thead><tbody>{reports.map(r=><tr key={r._id}><td><img className="table-image" src={imageUrl(r.imageUrl)} alt="Pothole"/><b>{r.title}</b><small>{new Date(r.createdAt).toLocaleDateString()}</small></td><td>{r.address}<small>{r.location.coordinates[1].toFixed(5)}, {r.location.coordinates[0].toFixed(5)}</small></td><td>{r.detection?.label}<small>{r.detection?.confidence ? `${Math.round(r.detection.confidence*100)}% confidence` : r.detection?.state}</small></td><td><span className="status">{r.status}</span></td><td><select value={r.status} onChange={e=>update(r._id,e.target.value)}><option>Reported</option><option>In Progress</option><option>Resolved</option></select></td></tr>)}</tbody></table>{!reports.length&&<p className="muted center">No reports submitted yet.</p>}</div></>;
}
