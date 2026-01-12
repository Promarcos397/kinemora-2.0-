import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SVG_PATH = path.join('resources', 'icon_k.svg');
const OUTPUT_SIDEBAR = path.join('build', 'installerSidebar.bmp'); // NSIS prefers BMP often, but let's try PNG first if supported or just name it bmp
// Actually electron-builder supports .bmp for sidebar.
// Let's create PNGs and see if electron builder handles them or if we need to force format.
// standard NSIS: .bmp. Electron-builder might convert.
// Let's output .png and use it.

async function generate() {
    console.log("Generating installer assets...");

    // Ensure build directory exists
    if (!fs.existsSync('build')) fs.mkdirSync('build');

    // Sidebar: 164x314 (Standard NSIS)
    // We'll make a dark theme sidebar with the K logo
    await sharp({
        create: {
            width: 164,
            height: 314,
            channels: 4,
            background: { r: 20, g: 20, b: 20, alpha: 1 } // #141414
        }
    })
        .composite([{
            input: SVG_PATH,
            gravity: 'center',
            resize: { width: 100 } // Smaller logo in center
        }])
        .bmp() // Sharp can output BMP? Check docs. Sharp supports PNG, JPEG, WebP, TIFF, AVIF, HEIF. 
        // It does NOT support BMP output natively in all versions.
        // Safe bet: Output PNG. Electron Builder docs say "installerSidebar" ... "The image must be a BMP".
        // Wait, some docs say electron-builder converts.
        // Let's try to make a PNG and see. If not, we might be stuck without a BMP encoder.
        .toFile(path.join('build', 'installerSidebar.bmp'));

    // Actually, Sharp 0.32+ might not support BMP output easily without libvips support.
    // Let's try PNG first, many modern NSIS plugins use PNG.
    // Electron-builder default NSIS: "The image must be a BMP".
    // If Sharp fails, I'll have to skip the custom sidebar or use a pre-existing image tool?
    // I will try to generate a PNG and name it .bmp? No that's risky.
    // Lets just generate PNG and point config to it. Electron-builder might convert it.

}

// Redoing with PNG target
async function generatePNGs() {
    console.log("Generating Installer PNGs...");
    if (!fs.existsSync('build')) fs.mkdirSync('build');

    // Sidebar
    const resizedIcon = await sharp(SVG_PATH).resize(100).toBuffer();

    await sharp({
        create: {
            width: 164,
            height: 314,
            channels: 3,
            background: '#141414'
        }
    })
        .composite([{
            input: resizedIcon,
            gravity: 'center',
        }])
        .png()
        .toFile(path.join('build', 'installerSidebar.png'));

    // Header: 150x57
    const headerIcon = await sharp(SVG_PATH).resize(40).toBuffer();

    await sharp({
        create: {
            width: 150,
            height: 57,
            channels: 3,
            background: '#141414'
        }
    })
        .composite([{ input: headerIcon, gravity: 'east' }])
        .png()
        .toFile(path.join('build', 'installerHeader.png'));

    console.log("Assets created.");
}

generatePNGs().catch(console.error);
