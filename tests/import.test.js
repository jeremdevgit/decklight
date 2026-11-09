import test from 'node:test';
import assert from 'node:assert/strict';
import {zipSync, strToU8} from 'fflate';
import {importStreamDeckArchive} from '../src/streamdeck-import.js';

const archive = entries => zipSync(Object.fromEntries(Object.entries(entries).map(([name,value])=>[name,typeof value==='string'?strToU8(value):value])));
const action = (UUID, Settings={}, title='Action') => ({UUID,Settings,States:[{Title:title}],State:0});

test('imports a legacy Stream Deck export, including images and original settings',()=>{
  const root='ABC.sdProfile/';
  const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==','base64'));
  const bundle=archive({
    [`${root}manifest.json`]:JSON.stringify({Name:'Legacy',Actions:{'0,0':{...action('com.elgato.streamdeck.system.hotkey',{Hotkeys:[{QTKeyCode:65,KeyCtrl:true}]},'Copy'),States:[{Title:'Copy',Image:'state0.png'}]},'1,0':action('com.elgato.streamdeck.profile.rotate',{ProfileUUID:'OTHER'},'Other')}}),
    [`${root}0,0/CustomImages/state0.png`]:png
  });
  const result=importStreamDeckArchive(bundle);
  assert.equal(result.profiles[0].name,'Legacy');
  assert.equal(result.profiles[0].pages[0].keys.length,2);
  assert.ok(result.profiles[0].pages[0].keys.some(key=>key.image?.startsWith('data:image/png;base64,')));
  assert.ok(result.profiles[0].pages[0].keys.every(key=>key.elgato?.UUID));
  assert.equal(result.profiles[0].pages[0].keys[0].action.value,'Ctrl+A');
  assert.equal(result.report.unsupported,1);
});

test('imports current page manifests, safe built-ins, and preserves plugin actions',()=>{
  const root='ABC.sdProfile/';
  const page='Profiles/PAGEA/';
  const bundle=archive({
    [`${root}manifest.json`]:JSON.stringify({Name:'Live',Device:{Model:'20GBD9901'},Pages:{Pages:['unused']},Version:'2.0'}),
    [`${root}${page}manifest.json`]:JSON.stringify({Controllers:[
      {Type:'Keypad',Actions:{'0,0':action('com.elgato.streamdeck.system.website',{path:'https://example.com'},'Website'),'1,0':action('com.elgato.obsstudio.scene',{scene:'Live'},'OBS')}},
      {Type:'Encoder',Actions:{'0,0':action('com.elgato.streamdeck.system.text',{text:'Hello'},'Dial')}}
    ]})
  });
  const result=importStreamDeckArchive(bundle);
  assert.equal(result.layout,'plus');
  assert.equal(result.report.actions,3);
  assert.equal(result.report.unsupported,1);
  const keys=result.profiles[0].pages[0].keys;
  assert.deepEqual(keys.map(k=>k.pos),[0,1,8]);
  assert.deepEqual(keys.map(k=>k.action.kind),['url','unsupported','text']);
  assert.equal(keys[1].elgato.Settings.scene,'Live');
});

test('imports a backup containing nested profile archives',()=>{
  const profile=archive({'ABC.sdProfile/manifest.json':JSON.stringify({Name:'Nested',Actions:{'0,0':action('com.elgato.streamdeck.system.website',{path:'https://example.com'})}})});
  const result=importStreamDeckArchive(archive({'Profiles/Nested.streamDeckProfile':profile}));
  assert.equal(result.profiles[0].name,'Nested');
});

test('reads V3 backup image paths and encoder row coordinates',()=>{
  const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLttAAAAABJRU5ErkJggg==','base64'));
  const root='ProfilesV3/ABC.sdProfile/';
  const page=`${root}Profiles/PAGE/`;
  const dial={...action('com.elgato.streamdeck.system.text',{text:'Dial'},'Dial'),Encoder:{Icon:'Images/icon.png'}};
  const bundle=archive({
    [`${root}manifest.json`]:JSON.stringify({Name:'Recent',Device:{Model:'20GBD9901'},Pages:{Pages:['PAGE']},Version:'3.0'}),
    [`${page}manifest.json`]:JSON.stringify({Name:'Main',Controllers:[{Type:'Encoder',Actions:{'0,2':dial}}]}),
    [`${page}Images/icon.png`]:png
  });
  const result=importStreamDeckArchive(bundle);
  assert.equal(result.profiles[0].pages[0].keys[0].pos,10);
  assert.ok(result.profiles[0].pages[0].keys[0].image.startsWith('data:image/png;base64,'));
});

test('rejects path traversal and missing profile archives',()=>{
  assert.throws(()=>importStreamDeckArchive(archive({'../ABC.sdProfile/manifest.json':'{}'})),/archive-path/);
  assert.throws(()=>importStreamDeckArchive(archive({'other.json':'{}'})),/no-profiles/);
});
