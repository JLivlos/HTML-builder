const path = require('path');
const fsPromises = require('fs/promises');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

async function getData() {
    try {
        const data = await fsPromises.readdir(folderPath, { withFileTypes: true });

        data.forEach(function(file) {
            if (file.isFile() === true) {
                let name = `${file.name.split(`${path.extname(file.name)}`).join('')}`;
                let ext = `${path.extname(file.name).slice(1, (file.name).length - 1)}`;
                fs.stat(path.join(folderPath, file.name), (err, stat) => {
                console.log(`${name} - ${ext} - ${+stat.size / 1000}kb`);          
            })
        };                
        });        
    } catch (err) {
        console.error(err);
    };
};
getData();