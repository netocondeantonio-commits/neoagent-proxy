const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/status", (req, res) => res.json({ status: "NeoAgent Proxy ativo ✅" }));

app.get("/neoenergia/download-ocr", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.infosimples.com/api/v2/consultas/contas/neoenergia/download-ocr",
      { params: req.query }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get("/neoenergia/download", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.infosimples.com/api/v2/consultas/contas/neoenergia/download",
      { params: req.query }
    );
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>NeoAgent</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,sans-serif;background:#080c14;color:#e2e8f0;min-height:100vh}
input,select{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:8px;padding:9px 12px;color:#e2e8f0;font-size:13px;width:100%;outline:none;font-family:inherit;box-sizing:border-box}
button{border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;border-radius:8px;padding:9px 18px;transition:all 0.2s}
button:disabled{opacity:0.5;cursor:not-allowed}
.header{border-bottom:1px solid rgba(74,222,128,0.1);background:rgba(0,0,0,0.5);position:sticky;top:0;z-index:50;padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between}
.tab{padding:7px 16px;border-radius:8px;background:transparent;color:#475569}
.tab.active{background:rgba(74,222,128,0.12);color:#4ade80}
.main{max-width:1100px;margin:0 auto;padding:24px}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px}
.kpi{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 18px}
.card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:14px 18px;cursor:pointer;margin-bottom:10px;transition:all 0.2s}
.card.exp{background:rgba(74,222,128,0.04);border-color:rgba(74,222,128,0.2)}
.badge{font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px}
.sbox{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:20px;margin-bottom:12px}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.fl{font-size:11px;color:#475569;font-weight:600;margin-bottom:5px;text-transform:uppercase}
.log-box{font-family:monospace;font-size:11.5px;max-height:400px;overflow-y:auto;padding:12px 16px;background:rgba(0,0,0,0.3);border-radius:10px;border:1px solid rgba(255,255,255,0.06)}
.toggle{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;transition:background 0.2s;display:inline-block}
.tdot{position:absolute;top:3px;width:18px;height:18px;border-radius:9px;background:#fff;transition:left 0.2s}
</style>
</head>
<body>
<div class="header">
  <div style="display:flex;align-items:center;gap:10px">
    <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#4ade80,#22d3ee);display:flex;align-items:center;justify-content:center;font-size:16px">⚡</div>
    <div>
      <div style="font-weight:800;font-size:15px;color:#f1f5f9">NeoAgent</div>
      <div style="font-size:10px;color:#334155">NEOENERGIA · INFOSIMPLES · CLAUDE AI</div>
    </div>
  </div>
  <div style="display:flex;gap:4px">
    <button class="tab active" onclick="go('dashboard')">Painel</button>
    <button class="tab" onclick="go('clientes')">Clientes</button>
    <button class="tab" onclick="go('config')">Config</button>
    <button class="tab" onclick="go('log')">Log</button>
  </div>
</div>
<div class="main">
  <div id="p-dashboard">
    <div class="kpi-grid">
      <div class="kpi"><div style="font-size:10px;color:#475569;font-weight:700;text-transform:uppercase;margin-bottom:6px">Clientes</div><div id="k-tot" style="font-size:20px;font-weight:800;color:#60a5fa">0</div></div>
      <div class="kpi"><div style="font-size:10px;color:#475569;font-weight:700;text-transform:uppercase;margin-bottom:6px">Concluidos</div><div id="k-done" style="font-size:20px;font-weight:800;color:#4ade80">0/0</div></div>
      <div class="kpi"><div style="font-size:10px;color:#475569;font-weight:700;text-transform:uppercase;margin-bottom:6px">Total Faturado</div><div id="k-fat" style="font-size:20px;font-weight:800;color:#fb923c">—</div></div>
      <div class="kpi"><div style="font-size:10px;color:#475569;font-weight:700;text-transform:uppercase;margin-bottom:6px">Referencia</div><div id="k-mes" style="font-size:20px;font-weight:800;color:#a78bfa">—</div></div>
    </div>
    <div id="demo-ban" style="background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.25);border-radius:10px;padding:10px 16px;margin-bottom:14px;font-size:12px;color:#a78bfa;display:flex;align-items:center;justify-content:space-between">
      <span>Modo Demo ativo — dados simulados. Va em Config para usar a API real.</span>
      <button onclick="toggleDemo()" style="background:rgba(167,139,250,0.15);border:1px solid rgba(167,139,250,0.3);color:#a78bfa;border-radius:6px;padding:4px 10px;font-size:11px">Desativar</button>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:18px;align-items:center">
      <button id="btn-all" onclick="processAll()" style="background:linear-gradient(135deg,#4ade80,#22d3ee);color:#080c14;font-size:13px">Processar Todos</button>
      <button onclick="resetAll()" style="background:rgba(255,255,255,0.05);color:#94a3b8;border:1px solid rgba(255,255,255,0.08)">Reset</button>
    </div>
    <div id="cards"></div>
  </div>

  <div id="p-clientes" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <div style="font-weight:800;font-size:18px;color:#f1f5f9">Gerenciar Clientes</div>
      <button onclick="openForm(null)" style="background:linear-gradient(135deg,#4ade80,#22d3ee);color:#080c14">+ Novo Cliente</button>
    </div>
    <div id="cform" style="display:none;background:rgba(255,255,255,0.03);border:1px solid rgba(74,222,128,0.2);border-radius:14px;padding:22px;margin-bottom:18px">
      <div style="font-weight:700;font-size:15px;margin-bottom:18px;color:#4ade80" id="ftitle">Novo Cliente</div>
      <div class="fg">
        <div><div class="fl">Nome</div><input id="fn" placeholder="Ex: Loja do Joao"/></div>
        <div><div class="fl">UC</div><input id="fuc" placeholder="Ex: 3001-0023"/></div>
        <div><div class="fl">CPF login</div><input id="fcpf" placeholder="000.000.000-00"/></div>
        <div><div class="fl">CNPJ login</div><input id="fcnpj" placeholder="00.000.000/0001-00"/></div>
        <div><div class="fl">Senha Neoenergia</div><input id="fsenha" type="password" placeholder="Senha do portal"/></div>
        <div><div class="fl">Multiplicador (1.35=35%)</div><input id="fmult" type="number" step="0.01" placeholder="1.30"/></div>
        <div><div class="fl">WhatsApp</div><input id="fwp" placeholder="11999990000"/></div>
        <div><div class="fl">UF</div><select id="fuf"><option>SP</option><option>RJ</option><option>MG</option><option>BA</option><option>PE</option><option>AL</option><option>GO</option><option>MA</option><option>MT</option><option>MS</option><option>PA</option><option>RN</option><option>PB</option></select></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:16px">
        <button onclick="closeForm()" style="background:rgba(255,255,255,0.05);color:#64748b;border:1px solid rgba(255,255,255,0.08)">Cancelar</button>
        <button onclick="saveClient()" style="background:linear-gradient(135deg,#4ade80,#22d3ee);color:#080c14">Salvar</button>
      </div>
    </div>
    <div id="clist"></div>
  </div>

  <div id="p-config" style="display:none;max-width:560px">
    <div style="font-weight:800;font-size:18px;color:#f1f5f9;margin-bottom:20px">Configuracoes</div>
    <div class="sbox" style="background:rgba(167,139,250,0.05);border-color:rgba(167,139,250,0.15)">
      <div style="font-size:13px;font-weight:700;color:#a78bfa;margin-bottom:10px">Modo Demo</div>
      <div style="font-size:12px;color:#64748b;margin-bottom:14px;line-height:1.7">Simula respostas da Infosimples sem gastar creditos.</div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="toggle" id="tog" onclick="toggleDemo()"><div class="tdot" id="tdot"></div></div>
        <span id="tlbl" style="font-size:13px;font-weight:600"></span>
      </div>
    </div>
    <div class="sbox">
      <div style="font-size:13px;font-weight:700;color:#4ade80;margin-bottom:14px">Token Infosimples</div>
      <div style="margin-bottom:14px">
        <div class="fl">Token de API</div>
        <input id="ctoken" type="password" placeholder="Cole seu token aqui..." oninput="saveCfg()"/>
        <div style="font-size:11px;color:#334155;margin-top:6px">Obtenha em: api.infosimples.com/administracao/tokens</div>
      </div>
      <div><div class="fl">Mes/Ano</div><input id="cmes" placeholder="03/2026" style="max-width:140px" oninput="saveCfg()"/></div>
    </div>
    <div class="sbox" style="background:rgba(74,222,128,0.03);border-color:rgba(74,222,128,0.12)">
      <div style="font-size:13px;font-weight:700;color:#4ade80;margin-bottom:10px">Proxy Railway</div>
      <div id="proxy-disp" style="font-size:11px;color:#4ade80;background:rgba(0,0,0,0.3);border-radius:8px;padding:8px 12px;margin-bottom:12px;font-family:monospace;word-break:break-all"></div>
      <div style="display:flex;align-items:center;gap:12px">
        <button onclick="testProxy()" id="tbtn" style="background:rgba(74,222,128,0.1);color:#4ade80;border:1px solid rgba(74,222,128,0.2)">Testar Conexao</button>
        <span id="pstatus" style="font-size:12px;font-weight:600"></span>
      </div>
    </div>
    <button onclick="go('dashboard')" style="background:linear-gradient(135deg,#4ade80,#22d3ee);color:#080c14;font-size:13px;padding:11px 28px">Salvar e Voltar</button>
  </div>

  <div id="p-log" style="display:none">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="font-weight:800;font-size:18px;color:#f1f5f9">Log de Atividades</div>
      <button onclick="clearLog()" style="background:rgba(255,255,255,0.05);color:#64748b;border:1px solid rgba(255,255,255,0.08);font-size:11px">Limpar</button>
    </div>
    <div class="log-box" id="lbox"></div>
  </div>
</div>

<script>
const PROXY = window.location.origin;
let C = JSON.parse(localStorage.getItem('nc')||'null') || [{id:1,name:"Comercio Silva",uc:"3001-0023",uf:"SP",loginCpf:"000.000.000-00",loginCnpj:"",loginSenha:"senha123",multiplier:1.35,contact:"11999990001",status:"idle",bill:null,message:"",error:""},{id:2,name:"Padaria Central",uc:"3001-0087",uf:"SP",loginCpf:"",loginCnpj:"00.000.000/0001-00",loginSenha:"senha456",multiplier:1.28,contact:"11999990002",status:"idle",bill:null,message:"",error:""}];
let CFG = JSON.parse(localStorage.getItem('ncfg')||'{"token":"","mesAno":"03/2026","demoMode":true}');
let logs=[], running=false, expId=null, editId=null;
const sc=()=>localStorage.setItem('nc',JSON.stringify(C));
const ts=()=>new Date().toLocaleTimeString('pt-BR');
const fmt=v=>'R$ '+parseFloat(v).toLocaleString('pt-BR',{minimumFractionDigits:2});
const calc=(v,m)=>(parseFloat(String(v).replace(',','.')||0)*m).toFixed(2);
const wa=(p,m)=>'https://wa.me/55'+p.replace(/\D/g,'')+'?text='+encodeURIComponent(m);

function lg(msg,t){logs.unshift({ts:ts(),msg,t:t||'d'});if(logs.length>100)logs.pop();renderLog();}
function clearLog(){logs=[{ts:ts(),msg:'Log limpo.',t:'i'}];renderLog();}
function renderLog(){const el=document.getElementById('lbox');if(!el)return;el.innerHTML=logs.map(e=>{const c=e.t==='ok'?'#4ade80':e.t==='err'?'#f87171':e.t==='i'?'#60a5fa':'#64748b';return '<div style="display:flex;gap:14px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.03)"><span style="color:#1e3a5f;min-width:64px">'+e.ts+'</span><span style="color:'+c+'">'+e.msg+'</span></div>';}).join('');}

function saveCfg(){CFG.token=document.getElementById('ctoken')?.value||CFG.token;CFG.mesAno=document.getElementById('cmes')?.value||CFG.mesAno;localStorage.setItem('ncfg',JSON.stringify(CFG));}

function toggleDemo(){CFG.demoMode=!CFG.demoMode;localStorage.setItem('ncfg',JSON.stringify(CFG));updToggle();if(document.getElementById('p-dashboard').style.display!=='none')renderDash();}

function updToggle(){
  const tog=document.getElementById('tog'),dot=document.getElementById('tdot'),lbl=document.getElementById('tlbl'),ban=document.getElementById('demo-ban');
  if(!tog)return;
  tog.style.background=CFG.demoMode?'#a78bfa':'rgba(255,255,255,0.1)';
  dot.style.left=CFG.demoMode?'22px':'3px';
  lbl.style.color=CFG.demoMode?'#a78bfa':'#475569';
  lbl.textContent=CFG.demoMode?'ATIVO':'Desativado';
  if(ban)ban.style.display=CFG.demoMode?'flex':'none';
}

async function testProxy(){
  const btn=document.getElementById('tbtn'),st=document.getElementById('pstatus');
  btn.textContent='Testando...';btn.disabled=true;
  try{const r=await fetch(PROXY+'/status');const d=await r.json();st.textContent='Online — '+d.status;st.style.color='#4ade80';lg('Proxy online','ok');}
  catch(e){st.textContent='Offline — '+e.message;st.style.color='#f87171';lg('Proxy offline: '+e.message,'err');}
  btn.textContent='Testar Conexao';btn.disabled=false;
}

function badge(s){const m={idle:{l:'Aguardando',c:'#64748b'},fetching:{l:'Buscando...',c:'#60a5fa'},generating:{l:'Gerando...',c:'#a78bfa'},done:{l:'Concluido',c:'#4ade80'},error:{l:'Erro',c:'#f87171'}};const x=m[s]||m.idle;return '<span class="badge" style="color:'+x.c+';background:'+x.c+'18;border:1px solid '+x.c+'30">'+x.l+'</span>';}

function renderDash(){
  const done=C.filter(c=>c.status==='done').length,errs=C.filter(c=>c.status==='error').length,tot=C.filter(c=>c._valorFinal).reduce((a,c)=>a+parseFloat(c._valorFinal||0),0);
  document.getElementById('k-tot').textContent=C.length;
  document.getElementById('k-done').textContent=done+'/'+C.length+(errs?' ('+errs+' erros)':'');
  document.getElementById('k-fat').textContent=tot>0?fmt(tot.toFixed(2)):'—';
  document.getElementById('k-mes').textContent=CFG.mesAno||'—';
  const ban=document.getElementById('demo-ban');if(ban)ban.style.display=CFG.demoMode?'flex':'none';
  let h='';
  C.forEach(c=>{
    const exp=expId===c.id,ocr=c.bill?.ocr||{};
    let det='';
    if(exp){
      det='<div style="margin-top:14px;padding-top:14px;border-top:1px solid rgba(255,255,255,0.06)">';
      if(c.status==='error'&&c.error)det+='<div style="padding:10px 14px;background:rgba(248,113,113,0.07);border:1px solid rgba(248,113,113,0.2);border-radius:8px;font-size:12px;color:#fca5a5;margin-bottom:12px">'+c.error+'</div>';
      if(c.bill){
        det+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div>';
        det+='<div style="font-size:11px;color:#4ade80;font-weight:700;margin-bottom:8px;text-transform:uppercase">Dados da Conta</div>';
        [['Vencimento',c.bill.data_vencimento||ocr.vencimento||'—'],['Consumo',ocr.consumo?ocr.consumo+' kWh':'—'],['Titular',c.bill.nome||ocr.cliente||'—'],['Cod Barras',ocr.codigo_barras||'—']].forEach(([k,v])=>{
          det+='<div style="display:flex;gap:8px;margin-bottom:5px;font-size:12px"><span style="color:#475569;min-width:80px">'+k+':</span><span style="color:#cbd5e1;font-size:'+(k==='Cod Barras'?10:12)+'px;word-break:break-all">'+v+'</span></div>';
        });
        det+='</div><div><div style="font-size:11px;color:#a78bfa;font-weight:700;margin-bottom:8px;text-transform:uppercase">Mensagem WhatsApp</div>';
        if(c.message){
          det+='<div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.15);border-radius:10px;padding:10px 12px;font-size:12px;color:#cbd5e1;line-height:1.7;white-space:pre-wrap;max-height:140px;overflow-y:auto">'+c.message+'</div>';
          det+='<a href="'+wa(c.contact,c.message)+'" target="_blank" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:7px 14px;border-radius:8px;background:rgba(37,211,102,0.12);border:1px solid rgba(37,211,102,0.3);color:#25d366;font-size:12px;font-weight:700;text-decoration:none">Abrir no WhatsApp</a>';
        }else{det+='<div style="font-size:12px;color:#334155">Processe para gerar mensagem.</div>';}
        det+='</div></div>';
      }
      det+='<div style="margin-top:10px"><button onclick="event.stopPropagation();processOne('+c.id+')" style="background:rgba(74,222,128,0.1);color:#4ade80;border:1px solid rgba(74,222,128,0.2);font-size:11px">Reprocessar</button></div></div>';
    }
    const bi=c.bill?'<div style="text-align:right"><div style="font-size:11px;color:#475569">Neoenergia → Cobrar</div><div style="font-size:13px;color:#94a3b8">'+fmt(c.bill.valor||0)+' <span style="color:#4ade80;font-weight:700">'+fmt(c._valorFinal||0)+'</span></div></div>':'';
    h+='<div class="card'+(exp?' exp':'')+'" onclick="toggle('+c.id+')">';
    h+='<div style="display:flex;align-items:center;justify-content:space-between"><div style="display:flex;align-items:center;gap:12px">';
    h+='<div style="width:38px;height:38px;border-radius:10px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.15);display:flex;align-items:center;justify-content:center;font-size:17px">🏪</div>';
    h+='<div><div style="font-weight:700;font-size:14px;color:#f1f5f9">'+c.name+'</div><div style="font-size:11px;color:#475569">UC '+c.uc+' · '+c.uf+' · '+Math.round((c.multiplier-1)*100)+'%</div></div></div>';
    h+='<div style="display:flex;gap:20px;align-items:center">'+bi+badge(c.status)+'</div></div>'+det+'</div>';
  });
  document.getElementById('cards').innerHTML=h;
}

function toggle(id){expId=expId===id?null:id;renderDash();}

function renderCList(){
  let h='';
  C.forEach(c=>{
    h+='<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">';
    h+='<div><div style="font-weight:700;font-size:14px">'+c.name+'</div><div style="font-size:11px;color:#475569;margin-top:2px">UC '+c.uc+' · '+c.uf+' · '+Math.round((c.multiplier-1)*100)+'% · '+c.contact+'</div></div>';
    h+='<div style="display:flex;gap:8px"><button onclick="openForm('+c.id+')" style="background:rgba(96,165,250,0.1);color:#60a5fa;border:1px solid rgba(96,165,250,0.2);font-size:11px">Editar</button>';
    h+='<button onclick="removeC('+c.id+')" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);font-size:11px">Remover</button></div></div>';
  });
  document.getElementById('clist').innerHTML=h;
}

function openForm(id){
  editId=id;
  document.getElementById('cform').style.display='block';
  document.getElementById('ftitle').textContent=id?'Editar Cliente':'Novo Cliente';
  if(id){const c=C.find(x=>x.id===id);document.getElementById('fn').value=c.name;document.getElementById('fuc').value=c.uc;document.getElementById('fcpf').value=c.loginCpf;document.getElementById('fcnpj').value=c.loginCnpj;document.getElementById('fsenha').value=c.loginSenha;document.getElementById('fmult').value=c.multiplier;document.getElementById('fwp').value=c.contact;document.getElementById('fuf').value=c.uf;}
  else{['fn','fuc','fcpf','fcnpj','fsenha','fwp'].forEach(x=>document.getElementById(x).value='');document.getElementById('fmult').value='1.30';document.getElementById('fuf').value='SP';}
}
function closeForm(){document.getElementById('cform').style.display='none';editId=null;}
function saveClient(){
  const e={name:document.getElementById('fn').value,uc:document.getElementById('fuc').value,loginCpf:document.getElementById('fcpf').value,loginCnpj:document.getElementById('fcnpj').value,loginSenha:document.getElementById('fsenha').value,multiplier:parseFloat(document.getElementById('fmult').value)||1.3,contact:document.getElementById('fwp').value,uf:document.getElementById('fuf').value,status:'idle',bill:null,message:'',error:''};
  if(!e.name||!e.uc)return;
  if(editId){C=C.map(c=>c.id===editId?Object.assign({},c,e):c);}else{C.push(Object.assign({id:Date.now()},e));}
  sc();closeForm();renderCList();lg((editId?'Atualizado':'Adicionado')+': '+e.name,'ok');
}
function removeC(id){C=C.filter(c=>c.id!==id);sc();renderCList();lg('Cliente removido.','i');}

function upd(id,p){C=C.map(c=>c.id===id?Object.assign({},c,p):c);sc();}

async function fetchBill(c){
  if(CFG.demoMode){await new Promise(r=>setTimeout(r,900+Math.random()*600));const v=(80+Math.random()*400).toFixed(2);return {valor:v,nome:c.name,uc:c.uc,data_vencimento:'10/'+CFG.mesAno,ocr:{cliente:c.name,consumo:Math.floor(300+Math.random()*1800),mes:CFG.mesAno.split('/')[0],ano:CFG.mesAno.split('/')[1],vencimento:'10/'+CFG.mesAno,codigo_barras:'8366 0000 0'+Math.floor(10000000+Math.random()*89999999)+' 0 '+CFG.mesAno.replace('/','')+'00000'}};}
  const p=new URLSearchParams({token:CFG.token,uc:c.uc,uf:c.uf,mes_ano:CFG.mesAno});
  if(c.loginCpf)p.set('login_cpf',c.loginCpf);else p.set('login_cnpj',c.loginCnpj);
  p.set('login_senha',c.loginSenha);
  const r=await fetch(PROXY+'/neoenergia/download-ocr?'+p.toString());
  if(!r.ok)throw new Error('HTTP '+r.status);
  const d=await r.json();
  if(d.code!==200)throw new Error(d.message||'Codigo '+d.code);
  return d.data?.[0]||d.data;
}

async function genMsg(c,bill){
  const ocr=bill.ocr||{};
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:500,system:'Voce e um assistente de faturamento. Responda APENAS com a mensagem de WhatsApp.',messages:[{role:'user',content:'Gere mensagem profissional de cobranca WhatsApp. Cliente: '+c.name+'. Vencimento: '+(bill.data_vencimento||ocr.vencimento||'')+'. Valor: R$ '+(c._valorFinal||bill.valor)+'. Consumo: '+(ocr.consumo||'N/A')+' kWh. Cod barras: '+(ocr.codigo_barras||'N/A')+'. Max 5 linhas.'}]})});
  const d=await r.json();return d.content?.[0]?.text||'Erro ao gerar mensagem.';
}

async function processOne(id){
  const c=C.find(x=>x.id===id);if(!c)return;
  upd(id,{status:'fetching',bill:null,message:'',error:''});renderDash();
  lg('['+c.name+'] '+(CFG.demoMode?'[DEMO] ':'')+'Consultando Infosimples...','i');
  try{
    const bill=await fetchBill(c);
    const vf=calc(bill.valor,c.multiplier);
    upd(id,{status:'generating',bill,_valorFinal:vf});renderDash();
    lg('['+c.name+'] Conta obtida. Final: '+fmt(vf),'ok');
    const msg=await genMsg(Object.assign({},c,{_valorFinal:vf}),bill);
    upd(id,{status:'done',message:msg});
    lg('['+c.name+'] Mensagem gerada.','ok');
  }catch(e){upd(id,{status:'error',error:e.message});lg('['+c.name+'] Erro: '+e.message,'err');}
  renderDash();
}

async function processAll(){
  if(running)return;
  if(!CFG.token&&!CFG.demoMode){lg('Configure o token!','err');go('config');return;}
  running=true;
  const btn=document.getElementById('btn-all');btn.textContent='Processando...';btn.disabled=true;
  lg('Iniciando ciclo '+(CFG.demoMode?'[DEMO] ':'')+'- '+C.length+' clientes','i');
  for(const c of C)await processOne(c.id);
  lg('Ciclo completo!','ok');
  running=false;btn.textContent='Processar Todos';btn.disabled=false;
}

function resetAll(){C=C.map(c=>Object.assign({},c,{status:'idle',bill:null,message:'',error:'',_valorFinal:null}));expId=null;sc();renderDash();lg('Reset.','i');}

function go(t){
  ['dashboard','clientes','config','log'].forEach(x=>{
    document.getElementById('p-'+x).style.display=x===t?'block':'none';
    document.querySelectorAll('.tab').forEach((b,i)=>{b.className='tab'+(['dashboard','clientes','config','log'][i]===t?' active':'');});
  });
  if(t==='dashboard')renderDash();
  if(t==='clientes')renderCList();
  if(t==='log')renderLog();
  if(t==='config'){document.getElementById('ctoken').value=CFG.token;document.getElementById('cmes').value=CFG.mesAno;document.getElementById('proxy-disp').textContent=PROXY;updToggle();}
}

lg('NeoAgent iniciado.'+(CFG.demoMode?' Modo Demo ativo.':' API real configurada.'),'i');
renderDash();updToggle();
</script>
</body>
</html>`);
});

app.listen(PORT, () => console.log("Proxy rodando na porta " + PORT));
