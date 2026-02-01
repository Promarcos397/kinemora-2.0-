const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const KEY_PATH = path.join(app.getAppPath(), 'credentials.json');

async function downloadFile(fileId) {
    try {
        // 1. Verify Credentials
        if (!fs.existsSync(KEY_PATH)) {
            return { success: false, error: 'credentials.json missing in app root' };
        }

        // 2. Auth
        const auth = new google.auth.GoogleAuth({
            keyFile: KEY_PATH,
            scopes: SCOPES,
        });

        const drive = google.drive({ version: 'v3', auth });

        // 3. Define Temp Path
        const tempDir = app.getPath('temp');
        const destPath = path.join(tempDir, `kinemora-${fileId}.cbz`);

        // 4. Cache Check
        if (fs.existsSync(destPath)) {
            console.log('[Drive] Cache hit:', destPath);
            return { success: true, path: destPath };
        }

        console.log('[Drive] Downloading:', fileId);

        // 5. Download Stream
        const dest = fs.createWriteStream(destPath);
        const res = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' }
        );

        await new Promise((resolve, reject) => {
            res.data
                .on('end', () => {
                    console.log('[Drive] Download complete');
                    resolve();
                })
                .on('error', err => {
                    console.error('[Drive] Stream error:', err);
                    reject(err);
                })
                .pipe(dest);
        });

        return { success: true, path: destPath };

    } catch (err) {
        console.error('[Drive] Download failed:', err);
        return { success: false, error: err.message };
    }
}

async function getFileStream(fileId) {
    try {
        if (!fs.existsSync(KEY_PATH)) throw new Error('No credentials');
        const auth = new google.auth.GoogleAuth({ keyFile: KEY_PATH, scopes: SCOPES });
        const drive = google.drive({ version: 'v3', auth });

        const res = await drive.files.get(
            { fileId: fileId, alt: 'media' },
            { responseType: 'stream' }
        );
        return { success: true, stream: res.data };
    } catch (err) {
        console.error('[Drive] Stream failed:', err);
        return { success: false, error: err.message };
    }
}

module.exports = { downloadFile, getFileStream };
