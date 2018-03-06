const { exec } = require('child_process');

module.exports = function(plop) {
    plop.setActionType('install', function (answers, config, plop) {
        return new Promise((resolve, reject) => {
            exec('npm install ' + config.module + ' --save', (err, stdout, stderr) => {
                console.log(stdout);
                if (err) {
                    return reject('install ' + config.module + ' FAIL');
                }
                resolve('install ' + config.module + ' OK');
            });
        });
    });

    plop.setActionType('uninstall', function (answers, config, plop) {
        return new Promise((resolve, reject) => {
            exec('npm uninstall ' + config.module + ' --save', (err, stdout, stderr) => {
                console.log(stdout);
                if (err) {
                    return reject('uninstall ' + config.module + ' FAIL');
                }
                resolve('uninstall ' + config.module + ' OK');
            });
        });
    });

    plop.setGenerator('dependencies', {
        description: 'install or uninstall dependencies',
        prompts: [
            {
                type: 'list',
                name: 'dependencies',
                message: 'dependency management',
                choices: [
                    'install', 'uninstall'
                ]
            },

        ],
        actions: function(answers) {
            const dependencies = ['beefy', 'highland', 'domready'];
            const actions = [];

            if (answers.dependencies == 'install') {
                dependencies.forEach(function(dependency){
                    actions.push({type: 'install', module: dependency});
                });
            }
            else if (answers.dependencies == 'uninstall') {
                dependencies.forEach(function(dependency){
                    actions.push({type: 'uninstall', module: dependency});
                });
            }

            return actions;
        }
    });
}
