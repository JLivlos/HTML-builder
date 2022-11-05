const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const dest = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const newAssets = path.join(dest, 'assets')

async function createFolder() {
    try {
        const projectDist = await fsPromises.mkdir(dest, { recursive: true });
    } catch (err) {
        console.error(err.message);
    };
};
createFolder();

async function copyAssets(src, newDir) {
    try {
        const assetsDist = await fsPromises.mkdir(newDir, { recursive: true });
        const data = await fsPromises.readdir(src, { withFileTypes: true });
        data.forEach(function(file) {
            if (file.isFile() === true) {
                fs.copyFile(path.join(src, file.name), path.join(newDir, file.name), err => {
                    if (err) throw err;
                });
            };
            if (file.isDirectory() === true) {
                let assetsDir = path.join(src, file.name);
                let copyDir = path.join(newDir, file.name);
                copyAssets(assetsDir, copyDir);
            };
        });
    } catch (err) {
        console.error(err.message);
    };
};
copyAssets(assets, newAssets);

async function deleteAssets(src, dest) {
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
                    deleteAssets(path.join(src, file.name), path.join(dest, file.name));
                }
            });
        };
    })
}
deleteAssets(assets, newAssets);

async function bundleStyles() {
    try {
        fs.writeFile(
            path.join(dest, 'style.css'),
            '',
            (err) => {
                if (err) throw err;
            }
        );
        const data = await fsPromises.readdir(styles);
        let files = [];
        data.forEach(function(file) {
            if (path.extname(file) === '.css') {
                const stream = fs.createReadStream(path.join(styles, file), 'utf-8');
                let data = '';
                stream.on('data', chunk => data += chunk);
                stream.on('end', () => {
                    fs.appendFile(
                        path.join(dest, 'style.css'),
                        `${data}\n`,
                        err => {
                            if (err) throw err;
                        }
                    );
                });
            };
        });
    } catch (err) {
        console.error(err);
    };
};
bundleStyles();

async function createHtml() {
    try {
        const dataComponents = await fsPromises.readdir(components);
        let dataIndex = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8');

        let htmlComponents = [];
        dataComponents.forEach(e => {
            if (path.extname(e) === '.html') htmlComponents.push(e);
        })

        htmlComponents.forEach(function(file, index) {
            if (path.extname(file) === '.html') {
                const name = file.split('.').slice(0, -1).join('.');
                async function getTemplates() {
                    let data = await fsPromises.readFile(path.join(components, file), 'utf-8');
                    dataIndex = dataIndex.replaceAll(`{{${name}}}`, data);
                    if (index === htmlComponents.length - 1) {
                        fs.writeFile(
                            path.join(dest, 'index.html'),
                            dataIndex,
                            (err) => {
                                if (err) throw err;
                            }
                        );
                    };
                }
                getTemplates();
            };
        });
    } catch (err) {
        if (err) throw err;
    };
};
createHtml();