const path = require('path');
const fs = require('fs');
const process = require('process');
const { stdin, stdout } = process;
process.on('exit', () => stdout.write('Goodbye!'));
process.on('SIGINT', () => process.exit());

fs.access(path.join(__dirname, 'text.txt'), fs.F_OK, (err) => {
    if (err) {
        fs.writeFile(
            path.join(__dirname, 'text.txt'),
            '',
            (err) => {
                if (err) throw err;
            }
        );
    }
});

stdout.write('Enter something, please\n');
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        process.exit();
    };
    fs.appendFile(
        path.join(__dirname, 'text.txt'),
        data,
        err => {
            if (err) throw err;
        }
    );
});