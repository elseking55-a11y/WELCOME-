import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

const API=import.meta.env.VITE_API_URL||"";
const Stat=({label,value,accent})=><div className={"stat "+(accent||"")}><span>{label}</span><strong>{value}</strong></div>;

async function api(path,body){
 if(!API) throw new Error("Backend API is not configured.");
 const res=await fetch(API.replace(/\/$/,"")+path,{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(body)});
 const data=await res.json().catch(()=>({}));
 if(!res.ok) throw new Error(data.message||"Request failed.");
 return data;
}

function Landing({onEnter}){
 const [mode,setMode]=useState("login");
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [key,setKey]=useState("");
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);

 const submit=async()=>{
   if(!email.trim()||!password) return setError("Enter your email and password.");
   if(!key.trim()) return setError("Enter your access key.");
   setBusy(true);setError("");
   try{
     const data=await api(mode==="login"?"/api/auth/login":"/api/auth/register",{email,password,accessKey:key});
     onEnter({email:data.user?.email||email,token:data.token||""});
   }catch(e){
     if(!API){onEnter({email,token:""});return;}
     setError(e.message);
   }finally{setBusy(false);}
 };

 return <main className="landing">
   <div className="ambient a"/><div className="ambient b"/>
   <section className="hero">
    <div className="market-art real-market-art">
      <img src="https://images.stockcake.com/public/7/2/6/726405d2-e46f-4e7c-a614-7f5d81fd89d7_large/bulls-bears-trading-stockcake.jpg" alt="Bull and bear market with real candlestick trading charts"/>
      <div className="market-overlay"/>
    </div>
    <div className="eyebrow">CUSTOM FOREX ENGINE • MULTI-USER MT5</div>
    <h1>WELCOME TO<br/><em>THE FOREX LIFE</em></h1>
    <div className="motto">NO EASY MONEY HERE.</div>
    <p className="lead">Each user gets a separate account, settings and MT5 connection.</p>
    <div className="access">
      <div className="auth-tabs"><button className={mode==="login"?"active":""} onClick={()=>setMode("login")}>SIGN IN</button><button className={mode==="register"?"active":""} onClick={()=>setMode("register")}>REGISTER</button></div>
      <div className="access-title">USER ACCOUNT</div>
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email address" autoComplete="email"/>
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" autoComplete={mode==="login"?"current-password":"new-password"}/>
      <div className="access-title key-label">PRIVATE ACCESS KEY</div>
      <input value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} type="password" placeholder="Enter your key"/>
      <button onClick={submit} disabled={busy}>{busy?"CONNECTING...":mode==="login"?"SIGN IN TO FOREX LIFE":"CREATE FOREX LIFE ACCOUNT"} <b>→</b></button>
      {error&&<small className="error">{error}</small>}
      {!API&&<small className="backend-note">Frontend mode: account data is not stored server-side until a backend API is connected.</small>}
    </div>
    <div className="pill-row"><span>SEPARATE USERS</span><span>MT5 LOGIN</span><span>RISK CONTROL</span></div>
    <p className="risk-note">Never place broker passwords or MT5 secrets in browser storage. Production credentials must be handled by the secure backend.</p>
   </section>
 </main>
}

function Dashboard({user}){
 const [auto,setAuto]=useState(false);
 const [mt5,setMt5]=useState({server:"",login:"",password:"",accountType:"demo"});
 const [mt5Status,setMt5Status]=useState("NOT CONNECTED");
 const [mt5Busy,setMt5Busy]=useState(false);
 const [mt5Error,setMt5Error]=useState("");
 const [settings,setSettings]=useState({risk:1,maxPositions:5,stopLoss:true,takeProfit:true,trailing:true,dailyLoss:5});
 const [saved,setSaved]=useState(false);

 const update=(name,value)=>setSettings(s=>({...s,[name]:value}));
 const connectMt5=async()=>{
   if(!mt5.server||!mt5.login||!mt5.password)return setMt5Error("Enter MT5 server, login and password.");
   setMt5Busy(true);setMt5Error("");setMt5Status("CONNECTING...");
   try{
     await api("/api/mt5/connect",{server:mt5.server,login:mt5.login,password:mt5.password,accountType:mt5.accountType});
     setMt5Status("CONNECTED");setMt5({...mt5,password:""});
   }catch(e){
     if(!API){setMt5Status("BACKEND REQUIRED");setMt5Error("MT5 credentials must be sent to the secure backend. This frontend does not fake a connection.");}
     else{setMt5Status("CONNECTION FAILED");setMt5Error(e.message);}
   }finally{setMt5Busy(false);}
 };
 const saveSettings=async()=>{
   setSaved(false);
   try{await api("/api/settings",{...settings,autoTrade:auto});setSaved(true);}
   catch(e){if(!API){setSaved(true);return;}setMt5Error(e.message);}
 };

 return <main className="dash">
  <header><div className="logo">FOREX <i>LIFE</i></div><div className="user-chip">{user.email}</div><div className={"connection "+(mt5Status==="CONNECTED"?"live":"")}><span/> {mt5Status}</div><button className={"auto "+(auto?"on":"")} onClick={()=>setAuto(!auto)}>AUTO TRADE {auto?"ON":"OFF"}</button></header>
  <section className="content">
   <div className="top"><div><div className="eyebrow">MULTI-USER ACCOUNT</div><h2>Trading Dashboard</h2><p>Your settings belong to this signed-in user. MT5 data appears only after a real backend connection.</p></div><button className="lock" onClick={()=>location.reload()}>LOCK</button></div>
   <div className="stats"><Stat label="Account" value={mt5Status==="CONNECTED"?"MT5 CONNECTED":"NOT CONNECTED"} accent={mt5Status==="CONNECTED"?"live-stat":""}/><Stat label="Balance" value="—"/><Stat label="Equity" value="—"/><Stat label="Open positions" value="—"/></div>
   <div className="grid">
    <article className="panel">
      <h3>MT5 Account Login</h3>
      <div className="field-grid">
        <label>Broker / MT5 Server<input value={mt5.server} onChange={e=>setMt5({...mt5,server:e.target.value})} placeholder="Broker-Server"/></label>
        <label>MT5 Login<input value={mt5.login} onChange={e=>setMt5({...mt5,login:e.target.value})} inputMode="numeric" placeholder="Account number"/></label>
        <label>Password<input value={mt5.password} onChange={e=>setMt5({...mt5,password:e.target.value})} type="password" autoComplete="off" placeholder="MT5 password"/></label>
        <label>Account Type<select value={mt5.accountType} onChange={e=>setMt5({...mt5,accountType:e.target.value})}><option value="demo">Demo</option><option value="real">Real</option></select></label>
      </div>
      <button className="primary-btn" onClick={connectMt5} disabled={mt5Busy}>{mt5Busy?"CONNECTING...":"CONNECT MT5 ACCOUNT"}</button>
      {mt5Error&&<div className="inline-error">{mt5Error}</div>}
      <div className="security-note">Credentials are never saved in localStorage by this frontend. A production backend must authenticate the user and connect the correct MT5 account server-side.</div>
    </article>
    <article className="panel">
      <h3>Analysis Engine</h3>
      <div className="signal-box" aria-label="Trading signal"><div className="signal-option buy"><span>↑</span><strong>BUY</strong><small>Qualified Setup</small></div><div className="signal-option sell"><span>↓</span><strong>SELL</strong><small>Qualified Setup</small></div><div className="signal-option wait active"><span>Ⅱ</span><strong>NO ENTRY</strong><small>Wait for confirmation</small></div></div>
      <div className="row"><span>Trend</span><b>Waiting for live market</b></div><div className="row"><span>RSI 14</span><b>—</b></div><div className="row"><span>ATR 14</span><b>—</b></div><div className="row"><span>Spread</span><b>—</b></div><div className="row"><span>Decision</span><b>NO FORCED ENTRY</b></div>
    </article>
   </div>
   <article className="panel settings-panel">
     <div className="panel-heading"><div><h3>User Auto Trade Settings</h3><p>These controls are per-user. Changes apply only to this account when the backend is connected.</p></div><button className={"switch "+(auto?"enabled":"")} onClick={()=>setAuto(!auto)}><span/>{auto?"AUTO TRADE ON":"AUTO TRADE OFF"}</button></div>
     <div className="settings-grid">
       <label className="setting-box"><span>Risk / trade</span><div><input type="number" min="0.1" max="10" step="0.1" value={settings.risk} onChange={e=>update("risk",Number(e.target.value))}/><b>%</b></div><small>Maximum risk per trade</small></label>
       <label className="setting-box"><span>Maximum positions</span><div><input type="number" min="1" max="50" value={settings.maxPositions} onChange={e=>update("maxPositions",Number(e.target.value))}/></div><small>Open trades allowed</small></label>
       <label className="setting-box"><span>Daily loss limit</span><div><input type="number" min="0.5" max="50" step="0.5" value={settings.dailyLoss} onChange={e=>update("dailyLoss",Number(e.target.value))}/><b>%</b></div><small>Stop new entries at limit</small></label>
       <label className="setting-box toggle-box"><span>Stop Loss</span><button onClick={()=>update("stopLoss",!settings.stopLoss)} className={"toggle "+(settings.stopLoss?"on":"")}>{settings.stopLoss?"ON":"OFF"}</button><small>Protect every new position</small></label>
       <label className="setting-box toggle-box"><span>Take Profit</span><button onClick={()=>update("takeProfit",!settings.takeProfit)} className={"toggle "+(settings.takeProfit?"on":"")}>{settings.takeProfit?"ON":"OFF"}</button><small>Use configured target</small></label>
       <label className="setting-box toggle-box"><span>Trailing Stop</span><button onClick={()=>update("trailing",!settings.trailing)} className={"toggle "+(settings.trailing?"on":"")}>{settings.trailing?"ON":"OFF"}</button><small>Manage profitable positions</small></label>
     </div>
     <button className="save-btn" onClick={saveSettings}>SAVE MY SETTINGS</button>{saved&&<span className="saved">SETTINGS READY FOR THIS USER</span>}
   </article>
   <article className="panel positions"><h3>Open Positions</h3><div className="empty">No live positions connected.</div></article>
  </section>
 </main>
}

function App(){const [user,setUser]=useState(null);return user?<Dashboard user={user}/>:<Landing onEnter={setUser}/>;}
createRoot(document.getElementById("root")).render(<App/>);
