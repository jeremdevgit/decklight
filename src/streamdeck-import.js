import { unzipSync, strFromU8 } from 'fflate';

const MAX_ARCHIVE = 25_000_000;
const MAX_EXPANDED = 45_000_000;
const MAX_MANIFEST = 2_000_000;
const MAX_IMAGE = 120_000;
const MAX_IMAGE_TOTAL = 1_500_000;
const MAX_ENTRIES = 4000;
const models = {
  '20GAM9901':'mini','20GAA9901':'mk2','20GAI9901':'mk2',
  '20GAT9901':'xl','20GAQ9901':'pedal','20GBD9901':'plus'
};
const grids = {mini:[3,2],mk2:[5,3],xl:[8,4],neo:[4,2],plus:[4,2],plusxl:[9,4],pedal:[3,1],studio:[16,2],mobile:[8,8]};
const color = '#6385ff';
const own = (obj,key) => Object.prototype.hasOwnProperty.call(obj,key);
const text = value => typeof value === 'string' ? value : '';
const clean = value => text(value).trim().slice(0,80);
const id = () => crypto.randomUUID();

function unpack(bytes) {
  if (bytes.length > MAX_ARCHIVE) throw Error('archive-too-large');
  let size = 0, count = 0;
  const files = unzipSync(bytes, {filter(file) {
    if (++count > MAX_ENTRIES || file.originalSize > MAX_MANIFEST && /\/manifest\.json$/i.test(file.name)) throw Error('archive-too-large');
    if (file.name.includes('..') || file.name.startsWith('/') || file.name.includes('\\')) throw Error('archive-path');
    const wanted = /\/manifest\.json$/i.test(file.name) || /\.(png|jpg|jpeg|webp|streamDeckProfile)$/i.test(file.name);
    if (!wanted || /\.(png|jpg|jpeg|webp)$/i.test(file.name) && file.originalSize > MAX_IMAGE) return false;
    if (/\.streamDeckProfile$/i.test(file.name) && file.originalSize > MAX_ARCHIVE) throw Error('archive-too-large');
    size += file.originalSize;
    if (size > MAX_EXPANDED) throw Error('archive-too-large');
    return true;
  }});
  return files;
}

function manifest(files,path) {
  const bytes = files[path];
  if (!bytes || bytes.length > MAX_MANIFEST) throw Error('manifest-missing');
  const value = JSON.parse(strFromU8(bytes));
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('manifest-invalid');
  return value;
}

function folderId(uuid) {
  return ((text(uuid).replace(/-/g,'') + '000').match(/.{5}/g) || [])
    .map(s => parseInt(s,16).toString(32).padStart(4,'0')).join('')
    .slice(0,26).toUpperCase().replace(/V/g,'W').replace(/U/g,'V') + 'Z';
}

function keyName(hotkey) {
  if (!hotkey || typeof hotkey !== 'object') return '';
  const qt = hotkey.QTKeyCode, vk = hotkey.VKeyCode;
  const code = Number.isInteger(qt) && qt !== 33554431 ? qt : vk;
  if (code >= 65 && code <= 90) return String.fromCharCode(code);
  if (code >= 48 && code <= 57) return String.fromCharCode(code);
  if (code >= 112 && code <= 123) return `F${code-111}`;
  return ({32:'Space',13:'Enter',8:'Backspace',9:'Tab',27:'Escape',
    16777220:'Enter',16777221:'Enter',16777216:'Escape',16777217:'Tab',16777219:'Backspace',
    16777235:'Up',16777237:'Down',16777234:'Left',16777236:'Right',
    38:'Up',40:'Down',37:'Left',39:'Right'})[code] || '';
}

function convertAction(raw, report) {
  const type = text(raw?.UUID).toLowerCase();
  const settings = raw?.Settings || {};
  const fail = () => { report.unsupported++; report.unsupportedTypes.add(type || 'unknown'); return {kind:'unsupported',value:type || 'unknown'}; };
  const media={mute:'Mute',volumeup:'VolumeUp',volumedown:'VolumeDown',mediaplay:'PlayPause',medianext:'NextTrack',mediaprevious:'PrevTrack'};
  const mediaName=type.replace('com.elgato.streamdeck.system.','');
  if (own(media,mediaName) && type.startsWith('com.elgato.streamdeck.system.')) return {kind:'hotkey',value:media[mediaName]};
  if (type === 'com.elgato.streamdeck.system.website') {
    const url = text(settings.path);
    if (url.length <= 16384 && /^(https?:\/\/|mailto:)/i.test(url)) return {kind:'url',value:url};
  }
  if (type === 'com.elgato.streamdeck.system.open') {
    const path = text(settings.path).replace(/^"(.*)"$/s,'$1');
    if (path.length <= 16384 && (path.startsWith('/') || /^[A-Za-z]:\\/.test(path))) return {kind:'app',value:path};
  }
  if (type === 'com.elgato.streamdeck.system.text') {
    if (typeof settings.text === 'string' && settings.text.length < 16384) return {kind:'text',value:settings.text + (settings.sendEnter?'\n':'')};
  }
  if (type === 'com.elgato.streamdeck.system.hotkey') {
    const h = settings.Hotkeys?.[0], key = keyName(h);
    if (key) {
      const mods = [h.KeyCtrl?'Ctrl':null,h.KeyOption?'Alt':null,h.KeyShift?'Shift':null,h.KeyCmd?'Meta':null].filter(Boolean);
      return {kind:'hotkey',value:[...mods,key].join('+')};
    }
  }
  if (type === 'com.elgato.streamdeck.multiactions.delay') {
    const ms = Number(settings.Delay);
    if (Number.isInteger(ms) && ms >= 0 && ms <= 10000) return {kind:'delay',value:String(ms)};
  }
  if (type === 'com.elgato.streamdeck.multiactions.routine' && !settings.RoutineAlt?.length && Array.isArray(settings.Routine) && settings.Routine.length <= 12) {
    const steps = settings.Routine.map(x => convertAction(x,report));
    if (steps.every(x => x.kind !== 'unsupported')) return {kind:'chain',value:'',steps};
    return fail();
  }
  return fail();
}

function controllers(page) {
  if (page.Actions && typeof page.Actions === 'object') return [{Type:'Keypad',Actions:page.Actions}];
  return Array.isArray(page.Controllers) ? page.Controllers.filter(x => x && typeof x.Actions === 'object') : [];
}

function imageFor(files,base,coord,state,report) {
  const name = text(state?.Image);
  if (!/^[\w.-]+\.(png|jpg|jpeg|webp)$/i.test(name)) return '';
  const path = `${base}${coord}/CustomImages/${name}`;
  const bytes = files[path];
  if (!bytes || bytes.length > MAX_IMAGE || report.imageBytes + bytes.length > MAX_IMAGE_TOTAL) {report.skippedImages++; return '';}
  report.imageBytes += bytes.length;
  const mime = /\.png$/i.test(name)?'image/png':/\.webp$/i.test(name)?'image/webp':'image/jpeg';
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return `data:${mime};base64,${btoa(binary)}`;
}

function pageFrom(files,path,pageManifest,columns,rows,report) {
  const base = path.slice(0,-'manifest.json'.length);
  const keys=[];
  for (const controller of controllers(pageManifest)) {
    const encoder = controller.Type === 'Encoder';
    for (const [coord,raw] of Object.entries(controller.Actions)) {
      if (!/^\d+,\d+$/.test(coord) || !raw || typeof raw !== 'object') continue;
      const [x,y] = coord.split(',').map(Number);
      const pos = encoder ? columns*rows+x : y*columns+x;
      if (x >= columns || !encoder && y >= rows || pos >= 128 || keys.some(k=>k.pos===pos)) {report.skippedActions++; continue;}
      const state = Array.isArray(raw.States) ? raw.States[Math.max(0,Number(raw.State)||0)] || raw.States[0] : {};
      const action = convertAction(raw,report);
      const key = {pos,label:clean(state?.Title || raw.Name || raw.UUID) || 'Stream Deck',icon:'',color,action,elgato:raw};
      const image = imageFor(files,base,coord,state,report);
      if (image) key.image=image;
      keys.push(key);
      report.actions++;
    }
  }
  return {id:id(),name:'',keys,elgato:pageManifest};
}

export function importStreamDeckArchive(bytes) {
  const files=unpack(bytes);
  const nested=Object.entries(files).filter(([name])=>/\.streamDeckProfile$/i.test(name));
  if (nested.length > 30) throw Error('archive-too-large');
  let nestedSize=0;
  for (const [name,contents] of nested) {
    const inner=unpack(contents);
    for (const [path,value] of Object.entries(inner)) {
      nestedSize+=value.length;
      if(nestedSize>MAX_EXPANDED) throw Error('archive-too-large');
      files[`${name}/${path}`]=value;
    }
    delete files[name];
  }
  const paths=Object.keys(files).filter(x=>/(^|\/)\w[^/]*\.sdProfile\/manifest\.json$/i.test(x) && !x.includes('/Profiles/'));
  if (!paths.length) throw Error('no-profiles');
  const report={profiles:0,pages:0,actions:0,unsupported:0,skippedActions:0,skippedImages:0,imageBytes:0,unsupportedTypes:new Set()};
  const profiles=[];
  let firstModel='mk2';
  let firstGrid=[5,3];
  for (const rootPath of paths.slice(0,30)) {
    const root=manifest(files,rootPath);
    const prefix=rootPath.slice(0,-'manifest.json'.length);
    const knownModel=models[text(root.Device?.Model || root.DeviceModel)];
    const pagePaths=Object.keys(files).filter(x=>x.startsWith(`${prefix}Profiles/`) && /\/manifest\.json$/i.test(x) && x.slice(prefix.length).split('/').length===3);
    const refs=Array.isArray(root.Pages?.Pages)?root.Pages.Pages:[];
    const order=new Map(refs.map((ref,i)=>[folderId(ref),i]));
    pagePaths.sort((a,b)=>(order.get(a.split('/').at(-2))??999)-(order.get(b.split('/').at(-2))??999));
    if (!pagePaths.length && controllers(root).length) pagePaths.push(rootPath);
    if (!pagePaths.length) continue;
    let maxX=2,maxY=0;
    if (!knownModel) for (const path of pagePaths) {
      const source=path===rootPath?root:manifest(files,path);
      for (const controller of controllers(source)) {
        if(controller.Type==='Encoder') continue;
        for (const coord of Object.keys(controller.Actions)) {
          if (!/^\d+,\d+$/.test(coord)) continue;
          const [x,y]=coord.split(',').map(Number);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);
        }
      }
    }
    const model=knownModel || 'custom';
    const [columns,rows]=knownModel?grids[knownModel]:[Math.min(16,maxX+1),Math.min(8,maxY+1)];
    if (!profiles.length) {firstModel=model;firstGrid=[columns,rows];}
    const pages=pagePaths.slice(0,40).map((path,i)=>{
      const source=path===rootPath?root:manifest(files,path);
      const page=pageFrom(files,path,source,columns,rows,report);
      page.name=clean(source.Name || (pagePaths.length===1?'Accueil':`Page ${i+1}`));
      report.pages++;
      return page;
    });
    for (const [index,page] of pages.entries()) {
      for (const key of page.keys) {
        const uuid=key.elgato?.UUID;
        if (uuid==='com.elgato.streamdeck.page.next' || uuid==='com.elgato.streamdeck.page.previous') {
          const delta=uuid.endsWith('.next')?1:-1;
          key.action={kind:'folder',value:pages[(index+delta+pages.length)%pages.length].id};
        }
      }
    }
    profiles.push({id:id(),name:clean(root.Name)||'Stream Deck',pages,columns,rows,virtualModel:model,elgato:{manifest:root,model:root.Device?.Model||root.DeviceModel||''}});
    report.profiles++;
  }
  if (!profiles.length) throw Error('no-profiles');
  const unsupported=profiles.flatMap(p=>p.pages.flatMap(pg=>pg.keys.filter(k=>k.action.kind==='unsupported')));
  report.unsupported=unsupported.length;
  report.unsupportedTypes=[...new Set(unsupported.map(k=>k.elgato?.UUID || 'unknown'))].sort();
  return {profiles,layout:firstModel,columns:firstGrid[0],rows:firstGrid[1],report};
}
