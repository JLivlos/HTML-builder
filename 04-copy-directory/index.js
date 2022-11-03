const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');


async function createFolder() {
    try {
        const data = await fsPromises.readdir(src);
        const newDir = await fsPromises.mkdir(dest, { recursive: true });
        for (let i = 0; i < data.length; i++) {
            fs.copyFile(path.join(src, `${data[i]}`), path.join(dest, `${data[i]}`), err => {
                if (err) throw err;
            })
        }
        const dataDest = await fsPromises.readdir(dest);
        if (data.length < dataDest.length) {
            dataDest.forEach(file => {
                fs.access(path.join(src, file), fs.F_OK, err => {
                    if (err) {
                        fs.rm(path.join(dest, file), err => {
                            if (err) throw err;
                        });
                    };
                });
            });
        };

    } catch (err) {
        console.error(err.message);
    };
};
createFolder();