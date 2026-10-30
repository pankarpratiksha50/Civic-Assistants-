import React, { useState } from "react";
import api from "../api";
export default function ChatPage(){
 const [question,setQuestion]=useState("How can I report a pothole?"),[messages,setMessages]=useState([]),[busy,setBusy]=useState(false);
 const ask=async e=>{e.preventDefault();if(!question.trim()||busy)return;const q=question;setMessages(m=>[...m,{role:"user",text:q}]);setQuestion("");setBusy(true);
 try{const {data}=await api.post("/ai/chat",{question:q});setMessages(m=>[...m,{role:"assistant",text:data.answer,sources:data.sources,mode:data.mode}]);}
 catch(err){setMessages(m=>[...m,{role:"assistant",text:err.response?.data?.message||"Assistant unavailable."}]);}finally{setBusy(false)}};
 return <div className="narrow"><div className="page-heading"><p className="eyebrow">RETRIEVAL-AUGMENTED GENERATION</p><h1>Civic AI assistant</h1><p className="muted">Ask questions about reporting road hazards and civic workflows.</p></div>
 <div className="panel chat-panel"><div className="chat-intro">✦ <b>How can I help?</b><p className="muted">Answers use the project's civic knowledge documents. Verify official procedures with your municipality.</p></div>
 {messages.map((m,i)=><div className={`message ${m.role}`} key={i}><b>{m.role==="user"?"You":"Civic AI"}</b><p>{m.text}</p>{m.sources?.length>0&&<small>Sources: {m.sources.join(", ")} · {m.mode}</small>}</div>)}
 <form className="chat-form" onSubmit={ask}><input value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask a civic question…"/><button className="primary" disabled={busy}>{busy?"…":"Send"}</button></form></div></div>;
}
