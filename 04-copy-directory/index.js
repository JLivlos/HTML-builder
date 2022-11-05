const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

async function copyFiles(src, dest) {
    try {
        const newDir = await fsPromises.mkdir(dest, { recursive: true });
        const data = await fsPromises.readdir(src, { withFileTypes: true });
        data.forEach(function(file) {
            if (file.isFile() === true) {
                fs.copyFile(path.join(src, file.name), path.join(dest, file.name), err => {
                    if (err) throw err;
                });
            };
            if (file.isDirectory() === true) {
                let srcDir = path.join(src, file.name);
                let destDir = path.join(dest, file.name);
                copyFiles(srcDir, destDir);
            };
        });
    } catch (err) {
        console.error(err.message);
    };
};
copyFiles(src, dest);

async function deleteFiles(src, dest) {
    const dataSrc = await fsPromises.readdir(src, { withFileTypes: true });
    const dataDest = await fsPromises.readdir(dest, { withFileTypes: true });

    dataDest.forEach(function(file) {
        if (file.isFile()) {
            fs.access(path.join(src, file.name), fs.F_OK, err => {
                if (err) {
                    fs.rm(path.join(dest, file.name), err => {
                        if (err) throw err;
                    });
                };
            });
        };
        if (file.isDirectory()) {
            let newSrc = path.join(src, file.name);
            let newDest = path.join(dest, file.name);
            fs.access(newSrc, fs.F_OK, err => {
                if (err) {
                    fs.rm(newDest, { recursive: true }, err => {
                        if (err) throw err;
                    });
                } else {
                    deleteFiles(path.join(src, file.name), path.join(dest, file.name));
                }
            });
        };
    })
}
deleteFiles(src, dest);