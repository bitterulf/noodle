const _ = require('highland');

const mainStream = _.pipeline(
    _.map(function(action) {
        if (!action.type) {
            return;
        }
        return action;
    }),
    _.compact(),
    _.map(function(action) {
        return action.type;
    }),
    _.uniq(),
    _.each(function(action) {
        console.log(action);
    })
);


mainStream.resume();

setTimeout(function() {
    mainStream.write({type: 'lol'});
}, 1000);

setTimeout(function() {
    mainStream.write({type: 'lol'});
}, 2000);

setTimeout(function() {
    mainStream.write({type: 'lol'});
}, 3000);

setTimeout(function() {
    mainStream.write({type: 'lal'});
}, 4000);

mainStream.write({});

const EventEmitter = require('events');

class Bus extends EventEmitter {}

const bus = new Bus();

var eventStream = _('event', bus);

eventStream
    .debounce(5000)
    .latest()
    .each(function (result) {
        console.log('zz', result);
    });

bus.emit('event', {});



