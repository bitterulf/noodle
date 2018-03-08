const _ = require('lodash');

const Sim = function() {
    this.timer = 0;
    this.actors = [];
    this.log = function(message) {
        console.log('[' + this.timer + '] ' + message);
    }
    this.dataPoints = [];
    this.addDataPoint = function(dataPoint) {
        dataPoint.time = this.timer;
        this.dataPoints.push(dataPoint);
    }
    this.records = [];
    this.record = function(record) {
        record.time = this.timer;
        this.records.push(record);
    }
    this.addActor = function(actor) {
        actor.addSim(this);
        this.actors.push(actor);
    }
    this.getTime = function() {
        return this.time;
    }
    this.tick = function() {
        this.timer++;
        this.actors.forEach(function(actor) {
            actor.tick();
        });
    },
    this.calcStatistics = function() {
        const result = {};
        this.dataPoints.forEach(function(dataPoint) {
            const key = dataPoint.origin.type + '_' + dataPoint.origin.name + '_' + dataPoint.type;
            if (!result[key]) {
                result[key] = {
                    dataPointCount: 0,
                    sum: 0,
                    min: dataPoint.value,
                    max: dataPoint.value
                }
            }

            result[key].dataPointCount++;
            result[key].sum += dataPoint.value;
            if (dataPoint.value < result[key].min) {
                result[key].min = dataPoint.value;
            }
            if (dataPoint.value > result[key].max) {
                result[key].max = dataPoint.value;
            }
        });

        _.keys(result).forEach(function(key) {
            result[key].average = result[key].sum / result[key].dataPointCount;
        });

        return result;
    }
}

const attachActorBasics = function(actor) {
    actor.sim = null;
    actor.addSim = function(sim) {
        actor.sim = sim;
    }
    actor.log = function(message) {
        actor.sim.log(actor.type + ' ' + actor.name + ': ' + message);
    }
    actor.record = function(event) {
        actor.sim.record({origin: {type: actor.type, name: actor.name}, type: event});
    }
    actor.addDataPoint = function(type, value) {
        actor.sim.addDataPoint({origin: {type: actor.type, name: actor.name}, type: type, value: value });
    }
}

const WareHouse = function(name, maxCapacity) {
    this.name = name;
    this.type = 'warehouse';
    this.stuff = [];
    this.maxCapacity = maxCapacity || 1;
    this.dropRequests = [];
    this.addDropRequest = function(request) {
        this.dropRequests.push(request);
    };
    this.fetchRequests = [];
    this.addFetchRequest = function(request) {
        this.fetchRequests.push(request);
    };

    attachActorBasics(this);

    this.tick = function () {
        const that = this;

        if (this.fetchRequests.length) {
            const fetchRequest = this.fetchRequests[0];
            const requestedStuff = _.countBy(fetchRequest.stuff);
            const storedStuff = _.countBy(that.stuff);
            let hasEnough = true;
            _.keys(requestedStuff).forEach(function(itemKey) {
                if (!storedStuff[itemKey] || storedStuff[itemKey] < requestedStuff[itemKey]) {
                    hasEnough = false;
                }
            });
            if (hasEnough) {
                const consumedStuff = {};
                fetchRequest.stuff = fetchRequest.stuff.filter(function(item) {
                    if (requestedStuff[item]) {
                        if (!consumedStuff[item]) {
                            consumedStuff[item] = 0;
                        }

                        if (consumedStuff[item] < requestedStuff[item]) {
                            consumedStuff[item]++;
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    return true;
                });

                fetchRequest.cb();
                this.fetchRequests.shift();
                this.record('stuff delivered');
            }
            else {
                this.log('not enough');
            }
        }

        if (this.dropRequests.length) {
            const dropRequest = this.dropRequests[0];
            if (dropRequest.stuff.length <= this.maxCapacity - this.stuff.length) {
                dropRequest.stuff.forEach(function(item) {
                    that.stuff.push(item);
                });
                dropRequest.cb();
                this.dropRequests.shift();
                this.record('stuff received');
            }
        }

        this.addDataPoint('capacity', this.maxCapacity - this.stuff.length);
    }
}

const Miner = function(name, wh) {
    this.name = name;
    this.type = 'miner';
    this.wh = wh;
    this.timer = 0;
    this.status = 'mining';

    attachActorBasics(this);

    this.tick = function() {
        if (this.status == 'mining') {
            this.timer++;
            if (this.timer > 1) {
                this.timer = 0;
                this.status = 'droping'
                this.log('miner mining');
                this.record('ore mined')
            }
        }
        else if (this.status == 'droping') {
            this.wh.addDropRequest({
                stuff: [
                    'ORE'
                ],
                cb: (function() {
                    this.log('recover from drop');
                    this.status = 'mining';
                }).bind(this)
            });
            this.status = 'waiting'
            this.record('waiting');
            this.log('miner droping');
        }
        else {
            this.record('waiting');
            this.log('waiting');
        }
    }
}

const Smith = function(name, wh, anvil) {
    this.name = name;
    this.type = 'smith';
    this.anvil = anvil;
    this.wh = wh;
    this.countdown = 0;
    this.status = 'idle';
    this.releaseAnvil = null;

    attachActorBasics(this);

    this.finishForgeWeapon = function() {
        this.record('weapon forged');
        this.status = 'idle';
        this.releaseAnvil();
        this.releaseAnvil = null;
    }

    this.startForgeAction = function(finishUse) {
        this.status = 'forging';
        this.countdown = 3;
        this.releaseAnvil = finishUse;
    }

    this.waitForAnvil = function() {
        const that = this;

        this.status = 'waitingForAnvil';
        that.anvil.addUseRequest({cb: function(finishUse) {
            that.startForgeAction(finishUse);
        }});
    }

    this.waitForOre = function() {
        const that = this;
        this.wh.addFetchRequest({
            stuff: ['ORE'],
            cb: (function() {
                this.waitForAnvil();
            }).bind(this)
        });

        this.status = 'waitForOre'
    }

    this.tick = function() {
        const that = this;
        if (this.status == 'idle') {
            this.record('idle');
            this.waitForOre();
        }
        else if (this.status == 'waitForOre') {
            this.record('waiting');
            this.log('smith is waiting for ore');
        }
        else if (this.status == 'waitingForAnvil') {
            this.record('waiting');
            this.log('smith is waiting for the anvil');
        }
        else if (this.status == 'forging') {
            this.record('forging');
            that.countdown--;
            if (!that.countdown) {
                this.finishForgeWeapon();
            }
            else {
                this.log('smith is forging');
            }
        }
    }
}

const Anvil = function(name) {
    this.name = name;
    this.type = 'anvil';
    this.maxUsers = 1;
    this.currentUsers = 0;
    this.useRequests = [];

    attachActorBasics(this);

    this.addUseRequest = function(request) {
        this.useRequests.push(request);
    };

    this.tick = function() {
        const that = this;

        if (this.currentUsers < this.maxUsers && this.useRequests.length) {
            const useRequest = this.useRequests.shift();
            this.currentUsers++;
            that.log('anvil in use');
            useRequest.cb(function() {
                that.log('anvil released');
                that.currentUsers--;
            });
        }
    }
}

const wh = new WareHouse('warehouse1', 2);

const anvil = new Anvil('anvil1');

const miner1 = new Miner('miner1', wh);
const smith1 = new Smith('smith1', wh, anvil);

const sim = new Sim();
sim.addActor(miner1);
sim.addActor(smith1);
sim.addActor(wh);
sim.addActor(anvil);

sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();
sim.tick();

console.log(sim.records);
console.log(sim.calcStatistics());
