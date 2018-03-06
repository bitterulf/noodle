const fs = require('fs');
const os = require('os');

module.exports = function(plop) {
    plop.setActionType('addScript', function (answers, config, plop) {
        return new Promise((resolve, reject) => {
            const package = JSON.parse(fs.readFileSync('./package.json').toString());
            package.scripts[config.name] = config.command;
            fs.writeFileSync('./package.json', JSON.stringify(package, null, 2) + os.EOL);
            resolve('script added');
        });
    });

    plop.setGenerator('scripts', {
        description: 'update npm scripts',
        prompts: [
        ],
        actions: function(answers) {
            const actions = [];

            actions.push({type: 'addScript', name: 'beefy', command: 'beefy ./src/app.js --live --cwd ./public'});

            return actions;
        }
    });
}
