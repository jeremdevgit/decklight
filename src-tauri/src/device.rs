use elgato_streamdeck::{info::Kind, list_devices, new_hidapi, StreamDeck, StreamDeckInput};
use font8x8::{UnicodeFonts, BASIC_FONTS};
use image::{DynamicImage, Rgb, RgbImage};
use serde::Serialize;
use std::{
    sync::{
        mpsc::{self, Sender},
        Mutex,
    },
    thread::{self, JoinHandle},
    time::Duration,
};
use tauri::{AppHandle, Emitter, State};

#[derive(Clone, Serialize)]
pub struct DeckInfo {
    pub serial: String,
    pub name: String,
    pub columns: u8,
    pub rows: u8,
    pub keys: u8,
    pub encoders: u8,
}

#[derive(Clone, serde::Deserialize)]
pub struct KeyFace {
    pub pos: u8,
    pub label: String,
    pub icon: String,
    pub color: String,
}

enum DeviceCommand {
    Display(Vec<KeyFace>),
    Stop,
}
struct Worker {
    sender: Sender<DeviceCommand>,
    handle: JoinHandle<()>,
}
#[derive(Default)]
pub struct DeviceRuntime(Mutex<Option<Worker>>);

fn info(kind: Kind, serial: String) -> DeckInfo {
    DeckInfo {
        serial,
        name: format!("Stream Deck {kind:?}"),
        columns: kind.column_count(),
        rows: kind.row_count(),
        keys: kind.key_count(),
        encoders: kind.encoder_count(),
    }
}

#[tauri::command]
pub fn list_decks() -> Result<Vec<DeckInfo>, String> {
    let hid = new_hidapi().map_err(|e| e.to_string())?;
    Ok(list_devices(&hid)
        .into_iter()
        .map(|(kind, serial)| info(kind, serial))
        .collect())
}

#[tauri::command]
pub fn connect_deck(
    app: AppHandle,
    runtime: State<DeviceRuntime>,
    serial: String,
) -> Result<DeckInfo, String> {
    stop(&runtime)?;
    let hid = new_hidapi().map_err(|e| e.to_string())?;
    let (kind, _) = list_devices(&hid)
        .into_iter()
        .find(|(_, id)| id == &serial)
        .ok_or("Device not found")?;
    let device = StreamDeck::connect(&hid, kind, &serial).map_err(|e| e.to_string())?;
    let result = info(kind, serial);
    let (sender, receiver) = mpsc::channel();
    let handle = thread::spawn(move || {
        let mut previous = vec![false; kind.key_count() as usize];
        let mut previous_encoders = vec![false; kind.encoder_count() as usize];
        loop {
            while let Ok(command) = receiver.try_recv() {
                match command {
                    DeviceCommand::Display(keys) => render_keys(&device, kind, keys),
                    DeviceCommand::Stop => return,
                }
            }
            match device.read_input(Some(Duration::from_millis(70))) {
                Ok(StreamDeckInput::ButtonStateChange(states)) => {
                    for (position, pressed) in states.iter().enumerate() {
                        if *pressed && !previous.get(position).copied().unwrap_or(false) {
                            let _ = app.emit("decklight-key", position);
                        }
                    }
                    previous = states;
                }
                Ok(StreamDeckInput::EncoderStateChange(states)) => {
                    for (index, pressed) in states.iter().enumerate() {
                        if *pressed && !previous_encoders.get(index).copied().unwrap_or(false) {
                            let _ = app.emit("decklight-key", kind.key_count() as usize + index);
                        }
                    }
                    previous_encoders = states;
                }
                Ok(StreamDeckInput::EncoderTwist(deltas)) => {
                    for (index, delta) in deltas.iter().enumerate() {
                        let offset = if *delta > 0 { 1 } else { 2 };
                        if *delta != 0 {
                            let position = kind.key_count() as usize
                                + offset * kind.encoder_count() as usize
                                + index;
                            let _ = app.emit("decklight-key", position);
                        }
                    }
                }
                Ok(_) => (),
                Err(error) => {
                    let _ = app.emit("decklight-disconnected", error.to_string());
                    return;
                }
            }
        }
    });
    *runtime.0.lock().map_err(|e| e.to_string())? = Some(Worker { sender, handle });
    Ok(result)
}

fn stop(runtime: &DeviceRuntime) -> Result<(), String> {
    if let Some(worker) = runtime.0.lock().map_err(|e| e.to_string())?.take() {
        let _ = worker.sender.send(DeviceCommand::Stop);
        let _ = worker.handle.join();
    }
    Ok(())
}

#[tauri::command]
pub fn disconnect_deck(runtime: State<DeviceRuntime>) -> Result<(), String> {
    stop(&runtime)
}

#[tauri::command]
pub fn display_deck(runtime: State<DeviceRuntime>, keys: Vec<KeyFace>) -> Result<(), String> {
    if let Some(worker) = runtime.0.lock().map_err(|e| e.to_string())?.as_ref() {
        worker
            .sender
            .send(DeviceCommand::Display(keys))
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

fn render_keys(device: &StreamDeck, kind: Kind, keys: Vec<KeyFace>) {
    if kind == Kind::Pedal {
        return;
    }
    for pos in 0..kind.key_count() {
        let face = keys.iter().find(|k| k.pos == pos);
        let img = draw_face(face);
        let _ = device.set_button_image(pos, DynamicImage::ImageRgb8(img));
    }
    let _ = device.flush();
}

fn draw_face(face: Option<&KeyFace>) -> RgbImage {
    let color = face
        .and_then(|f| parse_color(&f.color))
        .unwrap_or([29, 40, 58]);
    let mut img = RgbImage::from_pixel(144, 144, Rgb(color));
    if let Some(face) = face {
        let icon = face.icon.chars().next().unwrap_or('◆');
        paint_text(&mut img, &icon.to_string(), 6, 12);
        let line: String = face.label.chars().take(11).collect();
        paint_text(&mut img, &line, 3, 108);
    }
    img
}

fn parse_color(s: &str) -> Option<[u8; 3]> {
    let hex = s.strip_prefix('#')?;
    if hex.len() != 6 {
        return None;
    }
    Some([
        u8::from_str_radix(&hex[0..2], 16).ok()?,
        u8::from_str_radix(&hex[2..4], 16).ok()?,
        u8::from_str_radix(&hex[4..6], 16).ok()?,
    ])
}

fn paint_text(img: &mut RgbImage, text: &str, scale: u32, y: u32) {
    let glyphs: Vec<_> = text.chars().filter_map(|c| BASIC_FONTS.get(c)).collect();
    let width = glyphs.len() as u32 * 9 * scale;
    let start = (144_u32.saturating_sub(width)) / 2;
    for (index, glyph) in glyphs.iter().enumerate() {
        for (gy, row) in glyph.iter().enumerate() {
            for gx in 0..8 {
                if row & (1 << gx) == 0 {
                    continue;
                }
                for dy in 0..scale {
                    for dx in 0..scale {
                        let x = start + index as u32 * 9 * scale + gx * scale + dx;
                        let py = y + gy as u32 * scale + dy;
                        if x < 144 && py < 144 {
                            img.put_pixel(x, py, Rgb([255, 255, 255]));
                        }
                    }
                }
            }
        }
    }
}
