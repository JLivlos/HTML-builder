const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');


fs.writeFile(
    bundlePath,
    '',
    (err) => {
        if (err) throw err;
    }
);

async function writeStyles() {
    try {
        const data = await fsPromises.readdir(stylesPath);
        let files = [];
        data.forEach(function(file) {
            if (path.extname(file) === '.css') {
                const stream = fs.createReadStream(path.join(stylesPath, file), 'utf-8');
                let data = '';
                stream.on('data', chunk => data += chunk);
                stream.on('end', () => {
                    fs.appendFile(
                        bundlePath,
                        data,
                        err => {
                            if (err) throw err;
                        }
                    );
                });
            }
        });
    } catch (err) {
        console.error(err);
    };
};
writeStyles();