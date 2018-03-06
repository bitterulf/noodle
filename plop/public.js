module.exports = function(plop) {
    plop.setHelper("debug", function(optionalValue) {
        console.log(this);
    });

    plop.setGenerator('public', {
        description: 'add public directory',
        prompts: [
            {
                type: 'input',
                name: 'title',
                message: 'title please',
                default: 'title'
            }
        ],
        actions: function(answers) {

            const actions = [];

            actions.push({
                type: 'add',
                path: 'public/index.html',
                templateFile: 'plop/templates/index.hbs',
            });

            actions.push({
                type: 'add',
                path: 'public/data.json',
                template: '{}',
            });

            return actions;
        }
    });
}
