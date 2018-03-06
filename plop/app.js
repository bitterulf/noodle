module.exports = function(plop) {
    plop.setGenerator('app', {
        description: 'create entry point app',
        prompts: [
        ],
        actions: function(answers) {

            const actions = [];

            actions.push({
                type: 'add',
                path: 'src/app.js',
                templateFile: 'plop/templates/app.hbs',
            });

            return actions;
        }
    });
}
