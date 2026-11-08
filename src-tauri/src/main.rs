#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use enigo::{Direction, Enigo, Key, Keyboard, Settings};
mod device;

fn map_key(input: &str) -> Result<Key, String> {
    let name = input.trim().to_ascii_lowercase();
    let key = match name.as_str() {
        "ctrl" | "control" => Key::Control,
        "alt" | "option" => Key::Alt,
        "shift" => Key::Shift,
        "cmd" | "command" | "meta" | "super" | "win" => Key::Meta,
        "enter" | "return" => Key::Return,
        "tab" => Key::Tab,
        "esc" | "escape" => Key::Escape,
        "space" => Key::Space,
        "backspace" => Key::Backspace,
        "delete" => Key::Delete,
        "up" => Key::UpArrow,
        "down" => Key::DownArrow,
        "left" => Key::LeftArrow,
        "right" => Key::RightArrow,
        "home" => Key::Home,
        "end" => Key::End,
        "pageup" => Key::PageUp,
        "pagedown" => Key::PageDown,
        "playpause" => Key::MediaPlayPause,
        "nexttrack" => Key::MediaNextTrack,
        "prevtrack" => Key::MediaPrevTrack,
        "mute" => Key::VolumeMute,
        "volumeup" => Key::VolumeUp,
        "volumedown" => Key::VolumeDown,
        _ => {
            if let Some(n) = name.strip_prefix('f').and_then(|s| s.parse::<u8>().ok()) {
                match n {
                    1 => Key::F1,
                    2 => Key::F2,
                    3 => Key::F3,
                    4 => Key::F4,
                    5 => Key::F5,
                    6 => Key::F6,
                    7 => Key::F7,
                    8 => Key::F8,
                    9 => Key::F9,
                    10 => Key::F10,
                    11 => Key::F11,
                    12 => Key::F12,
                    _ => return Err(format!("Unsupported key: {input}")),
                }
            } else if name.chars().count() == 1 {
                Key::Unicode(name.chars().next().unwrap())
            } else {
                return Err(format!("Unsupported key: {input}"));
            }
        }
    };
    Ok(key)
}

#[tauri::command]
fn send_hotkey(combo: String) -> Result<(), String> {
    let parts: Vec<&str> = combo.split('+').collect();
    if parts.is_empty() || parts.len() > 5 {
        return Err("Hotkey must contain 1–5 keys".into());
    }
    let keys: Vec<Key> = parts.iter().map(|p| map_key(p)).collect::<Result<_, _>>()?;
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    for key in &keys[..keys.len() - 1] {
        enigo
            .key(*key, Direction::Press)
            .map_err(|e| e.to_string())?;
    }
    let result = enigo
        .key(*keys.last().unwrap(), Direction::Click)
        .map_err(|e| e.to_string());
    for key in keys[..keys.len() - 1].iter().rev() {
        let _ = enigo.key(*key, Direction::Release);
    }
    result
}

#[tauri::command]
fn type_text(value: String) -> Result<(), String> {
    if value.len() > 16_384 {
        return Err("Text exceeds 16 KiB".into());
    }
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    enigo.text(&value).map_err(|e| e.to_string())
}

#[tauri::command]
fn open_target(target: String, kind: String) -> Result<(), String> {
    if target.is_empty() || target.len() > 2048 {
        return Err("Invalid target".into());
    }
    if kind == "url" {
        let parsed = url::Url::parse(&target).map_err(|e| e.to_string())?;
        if !matches!(parsed.scheme(), "http" | "https" | "mailto") {
            return Err("Only http, https and mailto URLs are allowed".into());
        }
    } else if kind == "app" {
        let path = std::path::Path::new(&target);
        if !path.is_absolute() || !path.exists() {
            return Err("Choose an existing absolute path".into());
        }
    } else {
        return Err("Unknown target type".into());
    }
    opener::open(&target).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .manage(device::DeviceRuntime::default())
        .invoke_handler(tauri::generate_handler![
            send_hotkey,
            type_text,
            open_target,
            device::list_decks,
            device::connect_deck,
            device::disconnect_deck,
            device::display_deck
        ])
        .run(tauri::generate_context!())
        .expect("error while running Decklight");
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn rejects_unknown_and_unbounded_shortcuts() {
        assert!(map_key("Ctrl").is_ok());
        assert!(map_key("F12").is_ok());
        assert!(map_key("F99").is_err());
        assert!(map_key("Shell").is_err());
    }
}
