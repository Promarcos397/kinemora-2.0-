import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SVG_PATH = path.join('resources', 'icon_k.svg');
const OUTPUT_PNG = path.join('resources', 'icon.png');
const OUTPUT_ICO = path.join('resources', 'icon.ico');

async function generate() {
    console.log("Generating icons...");

    // Generate 512x512 PNG
    await sharp(SVG_PATH)
        .resize(512, 512)
        .png()
        .toFile(OUTPUT_PNG);
    console.log("Created icon.png");

    // For ICO, we ideally need multiple sizes combined, but for now let's just create a 256x256 PNG 
    // and rename it to .ico which often works for simple Electron builds, or use a specific tool.
    // However, Sharp doesn't output ICO natively. 
    // Electron-builder is smart enough to take a 512x512 PNG and create ICOs if properly configured,
    // or we can just leave it as PNG and point configuration to it.
    // But for "icon.ico" specifically:

    // We will just stick with the high-res PNG. Electron-builder handles .png icons very well for Windows 
    // if we don't force a .ico path that doesn't exist.
}

generate().catch(console.error);
