import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import "./styles.css";

const Stat=({label,value})=><div className="stat"><span>{label}</span><strong>{value}</strong></div>;

function Landing({onEnter}){
 const [key,setKey]=useState(""); const [error,setError]=useState("");
 const enter=()=>{if(!key.trim())return setError("Enter your access key to continue.");setError("");onEnter();};
 return <main className="landing">
   <div className="ambient a"/><div className="ambient b"/>
   <section className="hero">
    <div className="market-art" aria-hidden="true">
      <div className="chart"><span/><span/><span/><span/><span/><span/><span/></div>
      <div className="trend">↗</div><div className="coin">₿</div>
    </div>
    <div className="eyebrow">🧠 CUSTOM FOREX ENGINE • MT5 AUTO TRADING</div>
    <h1>WELCOME TO<br/><em>THE FOREX LIFE</em></h1>
    <div className="motto">NO EASY MONEY HERE.</div>
    <p className="lead">Read the market. Wait for confirmation. Execute with discipline.</p>
    <div className="access">
      <div className="access-title">🔑 PRIVATE ACCESS KEY</div>
      <input value={key} onChange={e=>setKey(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enter()} type="password" placeholder="Enter your key"/>
      <button onClick={enter}>ENTER THE FOREX LIFE <b>→</b></button>
      {error&&<small className="error">{error}</small>}
    </div>
    <div className="pill-row"><span>📊 SELECTIVE SIGNALS</span><span>🛡️ RISK CONTROL</span><span>⚡ MT5 EXECUTION</span></div>
    <p className="risk-note">Trading involves risk. Auto Trade will remain OFF until explicitly enabled.</p>
   </section>
 </main>
}

function Dashboard(){
 const [auto,setAuto]=useState(false);
 return <main className="dash">
  <header><div className="logo">FOREX <i>LIFE</i></div><div className="connection"><span/> MT5 READY</div><button className={"auto "+(auto?"on":"")} onClick={()=>setAuto(!auto)}>AUTO TRADE {auto?"ON 🟢":"OFF"}</button></header>
  <section className="content">
   <div className="top"><div><div className="eyebrow">CUSTOM ENGINE</div><h2>Trading Dashboard</h2><p>The engine can return <b>BUY</b>, <b>SELL</b> or <b>WAIT</b>. No forced entries.</p></div><button className="lock" onClick={()=>location.reload()}>🔒 LOCK</button></div>
   <div className="stats"><Stat label="Account" value="MT5 •••• 4821"/><Stat label="Balance" value="$0.00"/><Stat label="Equity" value="$0.00"/><Stat label="Open positions" value="0"/></div>
   <div className="grid">
    <article className="panel"><h3>🧠 Analysis Engine</h3><div className="signal">WAIT</div><div className="row"><span>Trend</span><b>Waiting for live market</b></div><div className="row"><span>RSI 14</span><b>—</b></div><div className="row"><span>ATR 14</span><b>—</b></div><div className="row"><span>Spread</span><b>—</b></div><div className="row"><span>Decision</span><b>NO FORCED ENTRY</b></div></article>
    <article className="panel"><h3>⚙️ Auto Trade Settings</h3><div className="row"><span>Risk / trade</span><b>1%</b></div><div className="row"><span>Maximum positions</span><b>5</b></div><div className="row"><span>Stop Loss</span><b className="good">ON</b></div><div className="row"><span>Take Profit</span><b className="good">ON</b></div><div className="row"><span>Trailing Stop</span><b className="good">ON</b></div><div className="row"><span>Daily loss limit</span><b>5%</b></div></article>
   </div>
   <article className="panel positions"><h3>📈 Open Positions</h3><div className="empty">No live positions connected.</div></article>
  </section>
 </main>
}

function App(){const [entered,setEntered]=useState(false);return entered?<Dashboard/>:<Landing onEnter={()=>setEntered(true)}/>};
createRoot(document.getElementById("root")).render(<App/>);