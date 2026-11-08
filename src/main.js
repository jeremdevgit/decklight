import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';
import { languages, t } from './i18n.js';
import './style.css';

const uid = () => crypto.randomUUID();
const starter = () => ({version:1,lang:'fr',columns:5,rows:3,virtualModel:'mk2',profiles:[{id:uid(),name:'Défaut',pages:[{id:uid(),name:'Accueil',keys:[]}]}]});
const clone = x => structuredClone(x);
const safe = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kinds=['url','app','hotkey','text','folder','chain','delay'];
const iconFor={url:'↗',app:'▣',hotkey:'⌘',text:'✎',folder:'▦',chain:'⛓',delay:'◷'};
function valid(data){
  if(!data || data.version!==1 || !languages.includes(data.lang) || !Number.isInteger(data.columns) || data.columns<3 || data.columns>16 || !Number.isInteger(data.rows) || data.rows<1 || data.rows>8 || !Array.isArray(data.profiles) || data.profiles.length<1 || data.profiles.length>30) throw Error('structure');
  for(const p of data.profiles){
    if(typeof p.id!=='string'||typeof p.name!=='string'||p.name.length>80||!Array.isArray(p.pages)||p.pages.length<1||p.pages.length>40) throw Error('profile');
    for(const page of p.pages){
      if(typeof page.id!=='string'||typeof page.name!=='string'||page.name.length>80||!Array.isArray(page.keys)||page.keys.length>128) throw Error('page');
      for(const item of page.keys){
        if(!Number.isInteger(item.pos)||item.pos<0||item.pos>=128||typeof item.label!=='string'||item.label.length>80||typeof item.icon!=='string'||item.icon.length>8||typeof item.color!=='string'||!/^#[0-9a-fA-F]{6}$/.test(item.color)) throw Error('key');
        checkAction(item.action);
      }
    }
  }
  return data;
}
function checkAction(a,depth=0){
  if(!a||!kinds.includes(a.kind)||typeof a.value!=='string'||a.value.length>16384||depth>1) throw Error('action');
  if(a.kind==='chain') {if(!Array.isArray(a.steps)||a.steps.length>12) throw Error('steps'); a.steps.forEach(s=>checkAction(s,depth+1));}
}
let data;
try{data=valid(JSON.parse(localStorage.getItem('decklight-v1')))}catch{data=starter()}
let profileId=data.profiles[0].id, pageId=data.profiles[0].pages[0].id, editing=null, toastTimer;
let devices=[], deviceInfo=null;
const layouts=[{id:'mini',name:'Mini',c:3,r:2,encoders:0},{id:'mk2',name:'Original / MK.2',c:5,r:3,encoders:0},{id:'xl',name:'XL',c:8,r:4,encoders:0},{id:'neo',name:'Neo',c:4,r:2,encoders:0},{id:'plus',name:'Plus',c:4,r:2,encoders:4},{id:'plusxl',name:'Plus XL',c:9,r:4,encoders:6},{id:'pedal',name:'Pedal',c:3,r:1,encoders:0},{id:'studio',name:'Studio (virtuel)',c:16,r:2,encoders:2},{id:'mobile',name:'Mobile (virtuel)',c:8,r:8,encoders:0}];
const app=document.querySelector('#app');
const tr=k=>t(k,data.lang);
const profile=()=>data.profiles.find(p=>p.id===profileId)||data.profiles[0];
const page=()=>profile().pages.find(p=>p.id===pageId)||profile().pages[0];
function persist(){localStorage.setItem('decklight-v1',JSON.stringify(data));render()}
function toast(message,bad=false){const el=document.querySelector('#toast');if(!el)return;el.textContent=message;el.className=bad?'show bad':'show';clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.className='',4500)}
function actionName(a){return tr(a?.kind||'action')}
function dialControls(pg){
  const encoders=deviceInfo?.encoders||layouts.find(x=>x.id===data.virtualModel)?.encoders||0;
  if(!encoders)return '';
  const names=['press','clockwise','counterclockwise'];
  const base=deviceInfo?.keys||data.columns*data.rows;
  return `<div class="dial-section"><h3>◉ ${tr('dials')} <small>${encoders}</small></h3><div class="dial-grid">${Array.from({length:encoders},(_,i)=>`<div class="dial-card"><div class="dial-wheel">${i+1}</div><div class="dial-actions">${names.map((name,offset)=>{const pos=base+offset*encoders+i,key=pg.keys.find(k=>k.pos===pos);return `<button data-run="${pos}" title="${tr(name)}">${offset===0?'●':offset===1?'↻':'↺'} <span>${safe(key?.label||tr(name))}</span></button><button class="dial-edit" data-edit="${pos}" title="${tr('edit')}">✎</button>`}).join('')}</div></div>`).join('')}</div></div>`;
}
function render(){
  const p=profile(),pg=page(), count=deviceInfo?.keys||data.columns*data.rows, columns=deviceInfo?.columns||data.columns;
  app.innerHTML=`<div class="shell"><aside><div class="brand"><span class="brandmark">D</span><div><strong>Decklight</strong></div></div><div class="sidehead device-head">${tr('devices')} <button id="refresh-devices" title="${tr('refresh')}">⟳</button></div><div class="devices"><button class="device ${deviceInfo?'':'active'}" id="virtual-device"><span class="device-icon">▦</span><span>${tr('virtual')}<small>${safe(layouts.find(x=>x.id===data.virtualModel)?.name||tr('custom'))}</small></span><span class="device-dot"></span></button>${devices.map(d=>`<button class="device ${deviceInfo?.serial===d.serial?'active':''}" data-device="${safe(d.serial)}"><span class="device-icon">▣</span><span>${safe(d.name)}<small>${d.keys} ${tr('keys')}</small></span><span class="device-dot"></span></button>`).join('')}${devices.length?'':`<p class="no-device">${tr('noDevice')}</p>`}</div><div class="sidehead">${tr('profiles')} <button id="new-profile" title="${tr('newProfile')}">＋</button></div><div id="profiles">${data.profiles.map(x=>`<button class="profile ${x.id===p.id?'active':''}" data-profile="${safe(x.id)}"><span>▦</span>${safe(x.name)}</button>`).join('')}</div><div class="sidefoot"><button id="import">⇧ ${tr('import')}</button><button id="export">⇩ ${tr('export')}</button><input hidden type="file" id="file-import" accept="application/json,.json"></div></aside><main><header><div><span class="eyebrow">DECKLIGHT / ${safe(p.name)}</span><h1>${tr('title')}</h1><p>${tr('subtitle')}</p></div><div class="header-actions"><select id="lang" aria-label="${tr('language')}">${languages.map(l=>`<option value="${l}" ${data.lang===l?'selected':''}>${l.toUpperCase()}</option>`).join('')}</select><button id="settings">⚙ ${tr('settings')}</button></div></header><div class="workspace"><div class="workspace-top"><div><span class="live-dot"></span><span>${deviceInfo?`${tr('connected')} · ${safe(deviceInfo.name)}`:tr('virtual')}</span><small>${safe(pg.name)} · ${count} ${tr('keys')}</small></div><select id="layout" aria-label="${tr('layout')}" ${deviceInfo?'disabled':''}><option value="custom">${tr('custom')}</option>${layouts.map(x=>`<option value="${x.id}" ${!deviceInfo&&data.virtualModel===x.id?'selected':''}>${x.name} · ${x.c}×${x.r}</option>`).join('')}</select></div><div class="toolbar"><div class="tabs">${p.pages.map(x=>`<button data-page="${safe(x.id)}" class="${x.id===pg.id?'selected':''}">${safe(x.name)}</button>`).join('')}<button id="new-page" title="${tr('newPage')}">＋</button></div><div class="toolbar-right"><button id="rename-page">✎</button><button id="delete-page">×</button></div></div><div class="deck" style="--columns:${columns}">${Array.from({length:count},(_,i)=>{const key=pg.keys.find(k=>k.pos===i);return `<div class="keywrap"><button class="key ${key?'filled':''}" data-run="${i}" style="--accent:${key?.color||'#60718c'}"><span class="key-icon">${safe(key?.icon|| (key?iconFor[key.action.kind]:'＋'))}</span><span class="key-name">${safe(key?.label||tr('empty'))}</span><span class="key-type">${key?`${safe(actionName(key.action))}`:`${String(i+1).padStart(2,'0')}`}</span></button><button class="editkey" data-edit="${i}" title="${tr('edit')}">✎</button></div>`}).join('')}</div>${dialControls(pg)}${window.__TAURI_INTERNALS__?'':`<div class="hint">${tr('preview')}</div>`}</div><section class="library"><h3>${tr('library')}</h3><div class="library-grid">${['hotkey','url','app','text','chain','folder'].map(k=>`<button data-add-kind="${k}"><span>${iconFor[k]}</span><strong>${tr(k)}</strong><small>＋</small></button>`).join('')}</div></section></main></div><div id="modal"></div><div id="toast" role="status"></div>`;
  if(deviceInfo)invoke('display_deck',{keys:pg.keys.filter(k=>k.pos<count).map(k=>({pos:k.pos,label:k.label,icon:k.icon||iconFor[k.action.kind],color:k.color}))}).catch(e=>toast(String(e),true));
  document.querySelector('#virtual-device').onclick=async()=>{if(deviceInfo){await invoke('disconnect_deck');deviceInfo=null;render()}};
  document.querySelector('#refresh-devices').onclick=refreshDevices;
  document.querySelectorAll('[data-device]').forEach(el=>el.onclick=async()=>{try{deviceInfo=await invoke('connect_deck',{serial:el.dataset.device});render()}catch(e){toast(String(e),true)}});
  document.querySelector('#layout').onchange=e=>{if(e.target.value==='custom')return openSettings();const layout=layouts.find(x=>x.id===e.target.value);if(!layout)return;data.columns=layout.c;data.rows=layout.r;data.virtualModel=layout.id;persist()};
  document.querySelectorAll('[data-profile]').forEach(el=>el.onclick=()=>{profileId=el.dataset.profile;pageId=profile().pages[0].id;render()});
  document.querySelectorAll('[data-page]').forEach(el=>el.onclick=()=>{pageId=el.dataset.page;render()});
  document.querySelectorAll('[data-run]').forEach(el=>el.onclick=()=>runKey(Number(el.dataset.run)));
  document.querySelectorAll('[data-edit]').forEach(el=>el.onclick=()=>openEditor(Number(el.dataset.edit)));
  document.querySelectorAll('[data-add-kind]').forEach(el=>el.onclick=()=>{const pos=Array.from({length:count},(_,i)=>i).find(i=>!pg.keys.some(k=>k.pos===i));if(pos===undefined)return toast('All keys are assigned',true);openEditor(pos);editing.action={kind:el.dataset.addKind,value:el.dataset.addKind==='folder'?p.pages[0].id:'',...(el.dataset.addKind==='chain'?{steps:[]}:{})};renderEditor()});
  document.querySelector('#new-profile').onclick=()=>{const name=prompt(tr('newProfile'));if(name?.trim()){const pg={id:uid(),name:'Accueil',keys:[]};const p={id:uid(),name:name.trim().slice(0,80),pages:[pg]};data.profiles.push(p);profileId=p.id;pageId=pg.id;persist()}};
  document.querySelector('#new-page').onclick=()=>{const name=prompt(tr('newPage'));if(name?.trim()){const pg={id:uid(),name:name.trim().slice(0,80),keys:[]};p.pages.push(pg);pageId=pg.id;persist()}};
  document.querySelector('#rename-page').onclick=()=>{const name=prompt(tr('label'),pg.name);if(name?.trim()){pg.name=name.trim().slice(0,80);persist()}};
  document.querySelector('#delete-page').onclick=()=>{if(p.pages.length<2)return toast('At least one page is required',true);if(confirm(tr('confirmDelete'))){p.pages=p.pages.filter(x=>x.id!==pg.id);pageId=p.pages[0].id;persist()}};
  document.querySelector('#lang').onchange=e=>{data.lang=e.target.value;persist()};
  document.querySelector('#settings').onclick=openSettings;
  document.querySelector('#export').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='decklight-profiles.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  document.querySelector('#import').onclick=()=>document.querySelector('#file-import').click();
  document.querySelector('#file-import').onchange=async e=>{try{const f=e.target.files[0];if(!f||f.size>2_000_000)throw Error('size');const imported=valid(JSON.parse(await f.text()));data=imported;profileId=data.profiles[0].id;pageId=data.profiles[0].pages[0].id;persist()}catch{toast(tr('importError'),true)}};
}
function showModal(html){document.querySelector('#modal').innerHTML=`<div class="shade"><section class="dialog">${html}</section></div>`;document.querySelector('.shade').onclick=e=>{if(e.target.classList.contains('shade'))closeModal()}}
function closeModal(){document.querySelector('#modal').innerHTML='';editing=null}
function openSettings(){showModal(`<h2>${tr('settings')}</h2><label>${tr('profiles')}<input id="profile-name" maxlength="80" value="${safe(profile().name)}"></label><label>${tr('columns')}<input id="cols" type="number" min="3" max="16" value="${data.columns}"></label><label>${tr('rows')}<input id="rows" type="number" min="1" max="8" value="${data.rows}"></label><div class="dialog-actions"><button id="delete-profile">${tr('remove')} ${tr('profiles')}</button><span></span><button id="cancel">${tr('cancel')}</button><button id="save" class="primary">${tr('save')}</button></div>`);document.querySelector('#cancel').onclick=closeModal;document.querySelector('#delete-profile').onclick=()=>{if(data.profiles.length<2)return toast('At least one profile is required',true);if(confirm(tr('confirmDelete'))){data.profiles=data.profiles.filter(p=>p.id!==profileId);profileId=data.profiles[0].id;pageId=profile().pages[0].id;closeModal();persist()}};document.querySelector('#save').onclick=()=>{profile().name=document.querySelector('#profile-name').value.trim().slice(0,80)||profile().name;data.columns=Math.max(3,Math.min(16,Number(document.querySelector('#cols').value)||5));data.rows=Math.max(1,Math.min(8,Number(document.querySelector('#rows').value)||3));data.virtualModel='custom';closeModal();persist()}}
function openEditor(pos){const current=page().keys.find(k=>k.pos===pos);editing={pos,label:current?.label||'',icon:current?.icon||'',color:current?.color||'#6385ff',action:clone(current?.action||{kind:'url',value:''})};renderEditor()}
function actionFields(action,index=-1){const prefix=index<0?'main':`step-${index}`;const options=kinds.filter(k=>index<0||!['chain','folder'].includes(k)).map(k=>`<option value="${k}" ${action.kind===k?'selected':''}>${tr(k)}</option>`).join('');const target=action.kind==='folder'?`<select class="value" data-prefix="${prefix}">${profile().pages.map(pg=>`<option value="${safe(pg.id)}" ${action.value===pg.id?'selected':''}>${safe(pg.name)}</option>`).join('')}</select>`:action.kind==='chain'?'':`<input class="value" data-prefix="${prefix}" value="${safe(action.value)}" placeholder="${action.kind==='url'?'https://…':action.kind==='hotkey'?'Ctrl+Shift+K':action.kind==='delay'?'500':''}">`;return `<div class="actionrow"><select class="kind" data-prefix="${prefix}">${options}</select>${target}${index>=0?`<button class="delstep" data-index="${index}">×</button>`:''}</div>`}
function renderEditor(){const a=editing.action;showModal(`<h2>${tr('edit')} · ${String(editing.pos+1).padStart(2,'0')}</h2><div class="formgrid"><label>${tr('label')}<input id="key-label" maxlength="80" value="${safe(editing.label)}"></label><label>${tr('icon')}<input id="key-icon" maxlength="8" value="${safe(editing.icon)}" placeholder="${iconFor[a.kind]}"></label><label>${tr('color')}<input id="key-color" type="color" value="${safe(editing.color)}"></label></div><label>${tr('action')}</label>${actionFields(a)}${a.kind==='chain'?`<div class="steps">${(a.steps||[]).map((s,i)=>actionFields(s,i)).join('')}</div><button id="add-step">＋ ${tr('addStep')}</button>`:''}<div class="dialog-actions"><button id="remove">${tr('remove')}</button><span></span><button id="cancel">${tr('cancel')}</button><button id="save" class="primary">${tr('save')}</button></div>`);
  const capture=()=>{editing.label=document.querySelector('#key-label').value;editing.icon=document.querySelector('#key-icon').value;editing.color=document.querySelector('#key-color').value;document.querySelectorAll('.value').forEach(el=>{const x=el.dataset.prefix==='main'?editing.action:editing.action.steps[Number(el.dataset.prefix.slice(5))];x.value=el.value})};
  document.querySelectorAll('.kind').forEach(el=>el.onchange=()=>{capture();const x=el.dataset.prefix==='main'?editing.action:editing.action.steps[Number(el.dataset.prefix.slice(5))];x.kind=el.value;x.value=x.kind==='folder'?profile().pages[0].id:'';if(x.kind==='chain')x.steps=[];renderEditor()});
  document.querySelectorAll('.delstep').forEach(el=>el.onclick=()=>{capture();editing.action.steps.splice(Number(el.dataset.index),1);renderEditor()});
  const add=document.querySelector('#add-step');if(add)add.onclick=()=>{capture();if(editing.action.steps.length<12){editing.action.steps.push({kind:'hotkey',value:''});renderEditor()}};
  document.querySelector('#cancel').onclick=closeModal;
  document.querySelector('#remove').onclick=()=>{if(confirm(tr('confirmDelete'))){page().keys=page().keys.filter(k=>k.pos!==editing.pos);closeModal();persist()}};
  document.querySelector('#save').onclick=()=>{capture();try{checkAction(editing.action);if(editing.action.kind==='url'&&!/^https?:\/\/|^mailto:/i.test(editing.action.value))throw Error('URL');if(editing.action.kind==='delay'&&(!/^\d+$/.test(editing.action.value)||Number(editing.action.value)>10000))throw Error('delay');const key={pos:editing.pos,label:editing.label.trim().slice(0,80)||tr(editing.action.kind),icon:editing.icon.slice(0,8),color:editing.color,action:editing.action};page().keys=page().keys.filter(k=>k.pos!==key.pos);page().keys.push(key);closeModal();persist()}catch(e){toast(String(e.message),true)}};
}
function usesKeyboard(a){return a.kind==='hotkey'||a.kind==='text'||a.kind==='chain'&&(a.steps||[]).some(usesKeyboard)}
async function runKey(pos,fromDevice=false){const key=page().keys.find(k=>k.pos===pos);if(!key){if(!fromDevice)openEditor(pos);return}let hidden=false;try{if(!fromDevice&&window.__TAURI_INTERNALS__&&usesKeyboard(key.action)){await getCurrentWindow().hide();hidden=true;await new Promise(r=>setTimeout(r,300))}await execute(key.action);toast(tr('ready'))}catch(e){toast(`${tr('failed')}: ${e.message||e}`,true)}finally{if(hidden)await getCurrentWindow().show()}}
async function execute(a){if(a.kind==='folder'){const target=profile().pages.find(p=>p.id===a.value);if(!target)throw Error('Page missing');pageId=target.id;render();return}if(a.kind==='chain'){for(const step of a.steps||[])await execute(step);return}if(a.kind==='delay'){await new Promise(r=>setTimeout(r,Math.min(10000,Math.max(0,Number(a.value)||0))));return}if(!window.__TAURI_INTERNALS__)throw Error(tr('desktopOnly'));if(a.kind==='url'||a.kind==='app')return invoke('open_target',{target:a.value,kind:a.kind});if(a.kind==='hotkey')return invoke('send_hotkey',{combo:a.value});if(a.kind==='text')return invoke('type_text',{value:a.value})}
async function refreshDevices(){if(!window.__TAURI_INTERNALS__)return;try{const found=await invoke('list_decks');if(JSON.stringify(found)!==JSON.stringify(devices)){devices=found;render()}}catch(e){toast(String(e),true)}}
render();
if(window.__TAURI_INTERNALS__){
  listen('decklight-key',event=>runKey(Number(event.payload),true));
  listen('decklight-disconnected',event=>{deviceInfo=null;render();toast(String(event.payload),true)});
  refreshDevices();
  setInterval(refreshDevices,10000);
}
