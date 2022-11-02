const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

async function letData() {
    try {
        const data = await fsPromises.readdir(folderPath, { withFileTypes: true });

        let files = [];
        data.forEach(function(file) {
            if (file.isFile() === true) files.push(file.name);
        });

        for (let i = 0; i < files.length; i++) {
            fs.stat(path.join(folderPath, files[i]), (err, stat) => {
                let arr = files[i].split('.');
                console.log(`${arr[0]} - ${arr[1]} - ${+stat.size / 1000}kb`);
            })
        }
    } catch (err) {
        console.error(err);
    };
};
letData();