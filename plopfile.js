const path = require('path');
const fs = require('fs');

module.exports = function (plop) {
    fs.readdirSync(path.join(__dirname, 'plop')).forEach(function(file) {
        require('./plop/' + file)(plop);
    });
};
