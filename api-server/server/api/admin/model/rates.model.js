'use strict';

class BTCRatesModel {

  /**
   * Class Constructor 
   */
  constructor(server) {
    let connection = server.connection;
    let mongoose   = server.lib;
    let Schema     = mongoose.Schema;

    // Rates Schema Definition
    let ratesSchema = new Schema({
      pool: {
        price: { type: Number }, 
        precent: { type: Number }, 
        power: { type: Number }, 
        pv: { type: Number }, 
        persons: { type: Number }, 
        machine: { type: Number }, 
        powerCost: { type: Number }, 
        profitCost: { type: Number }
      },
      machine: {
        price: { type: Number }, 
        precent: { type: Number }, 
        power: { type: Number }, 
        pv: { type: Number }, 
        persons: { type: Number }, 
        machine: { type: Number }, 
        powerCost: { type: Number }, 
        profitCost: { type: Number }
      },
      rack: {
        price: { type: Number }, 
        precent: { type: Number }, 
        power: { type: Number }, 
        pv: { type: Number }, 
        persons: { type: Number }, 
        machine: { type: Number }, 
        powerCost: { type: Number }, 
        profitCost: { type: Number }
      },
      active: { type: Boolean },
      created_at: { type: Date, "default": Date.now },
      updated_at: { type: Date }
    });

    // Rates Schema
    this.Rates = connection.model('pmrrate', ratesSchema);
  }

  /**
   * Get Rates
   * @param {callback} cb 
   */
  getRates(cb) {
    return this.Rates.findOne({"active": true}, '-_id pool machine rack', cb)
  }
  
  /**
   * 
   * @param {callback} cb 
   */
  ratesInactive(cb) {
    let newDate = (new Date()).toISOString();
    return this.Rates.findOneAndUpdate({"active": true}, {"$set": {"updated_at": newDate, "active": false}}, {"upsert": false}, cb);
  }

  /**
   * 
   * @param {Object} newValue 
   * @param {callback} cb 
   */
  createRates(newValue, cb) {
    let that = this;

    return that.ratesInactive((e, r) => {
      if(!e) {
        let rateData = {
          "pool": {
            "price": (newValue.poolPrice ? newValue.poolPrice : (r && r.pool && r.pool.price ? r.pool.price : null)),
            "precent": (newValue.poolPercent ? newValue.poolPercent : (r && r.pool && r.pool.precent ? r.pool.precent : null)), 
            "power": (newValue.poolPower ? newValue.poolPower : (r && r.pool && r.pool.power ? r.pool.power : null)), 
            "pv": (newValue.poolPv ? newValue.poolPv : (r && r.pool && r.pool.pv ? r.pool.pv : null)), 
            "persons": (newValue.poolPerson ? newValue.poolPerson : (r && r.pool && r.pool.persons ? r.pool.persons : null)), 
            "machine": (newValue.poolMachine ? newValue.poolMachine : (r && r.pool && r.pool.machine ? r.pool.machine : null)), 
            "powerCost": (newValue.poolPowerCost ? newValue.poolPowerCost : (r && r.pool && r.pool.powerCost ? r.pool.powerCost : null)), 
            "profitCost": (newValue.poolProfitCost ? newValue.poolProfitCost : (r && r.pool && r.pool.profitCost ? r.pool.profitCost : null))
          },
          "machine": {
            "price": (newValue.machinePrice ? newValue.machinePrice : (r && r.machine && r.machine.price ? r.machine.price : null)),
            "precent": (newValue.machinePercent ? newValue.machinePercent : (r && r.machine && r.machine.precent ? r.machine.precent : null)), 
            "power": (newValue.machinePower ? newValue.machinePower : (r && r.machine && r.machine.power ? r.machine.power : null)), 
            "pv": (newValue.machinePv ? newValue.machinePv : (r && r.machine && r.machine.pv ? r.machine.pv : null)), 
            "persons": (newValue.machinePerson ? newValue.machinePerson : (r && r.machine && r.machine.persons ? r.machine.persons : null)), 
            "machine": (newValue.machineMachine ? newValue.machineMachine : (r && r.machine && r.machine.machine ? r.machine.machine : null)), 
            "powerCost": (newValue.machinePowerCost ? newValue.machinePowerCost : (r && r.machine && r.machine.powerCost ? r.machine.powerCost : null)), 
            "profitCost": (newValue.machineProfitCost ? newValue.machineProfitCost : (r && r.machine && r.machine.profitCost ? r.machine.profitCost : null))
          },
          "rack": {
            "price": (newValue.rackPrice ? newValue.rackPrice : (r && r.rack && r.rack.price ? r.rack.price : null)),
            "precent": (newValue.rackPercent ? newValue.rackPercent : (r && r.rack && r.rack.precent ? r.rack.precent : null)), 
            "power": (newValue.rackPower ? newValue.rackPower : (r && r.rack && r.rack.power ? r.rack.power : null)), 
            "pv": (newValue.rackPv ? newValue.rackPv : (r && r.rack && r.rack.pv ? r.rack.pv : null)), 
            "persons": (newValue.rackPerson ? newValue.rackPerson : (r && r.rack && r.rack.persons ? r.rack.persons : null)), 
            "machine": (newValue.rackMachine ? newValue.rackMachine : (r && r.rack && r.rack.machine ? r.rack.machine : null)), 
            "powerCost": (newValue.rackPowerCost ? newValue.rackPowerCost : (r && r.rack && r.rack.powerCost ? r.rack.powerCost : null)), 
            "profitCost": (newValue.rackProfitCost ? newValue.rackProfitCost : (r && r.rack && r.rack.profitCost ? r.rack.profitCost : null))
          },
          "updated_at": (new Date()).toISOString(),
          "active": true
        };
        
        let rates = new this.Rates(rateData);
        return rates.save(cb);
      }
      else {
        return cb(true, 'Unable to obtain lock, request is cancelled.');
      }
    });
  }
}

module.exports = BTCRatesModel;
module.exports.getName = () => {
  return 'pmrrates';
}