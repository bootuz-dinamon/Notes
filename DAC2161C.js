const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;
const tuya = require("zigbee-herdsman-converters/lib/tuya");


const fzLocal = {
    tuya_xocadinrail_switch: {
        cluster: 'manuSpecificTuya',
        type: ['commandDataResponse', 'commandDataReport'],
        convert: (model, msg, publish, options, meta) => {
            for (const dpValue of msg.data.dpValues) {
                const value = tuya.getDataValue(dpValue);
                const dp = dpValue.dp
                meta.logger.info(`RECEIVED DP #${dp} -- VALUE = ${value}`);

                switch (dp) {
                    case 16: // DPID that we added to common
                        return {
                            state: value ? 'ON' : 'OFF'
                        };
                    case 1:
                        return {
                            energy: value / 100
                        };
                    case 6:   
//                     return {
//                            current: (value[4] / 1000), voltage: (value[1]), power: value[7]
//                        };
                        meta.logger.warn(`zigbee-herdsman-converters:: NOT RECOGNIZED DP ` +
                            `#${dp} with data ${JSON.stringify(msg.data)} VALUE = ${value}`);
                    case 10:{
                        meta.logger.warn(`zigbee-herdsman-converters:: NOT RECOGNIZED DP ` +
                            `#${dp} with data ${JSON.stringify(msg.data)} VALUE = ${value}`);
                    }
                    case 17:{
                        meta.logger.warn(`zigbee-herdsman-converters:: NOT RECOGNIZED DP ` +
                            `#${dp} with data ${JSON.stringify(msg.data)} VALUE = ${value}`);
                    }
                    case 18:{
                        meta.logger.warn(`zigbee-herdsman-converters:: NOT RECOGNIZED DP ` +
                            `#${dp} with data ${JSON.stringify(msg.data)} VALUE = ${value}`);
                    }
                    default: {
                        meta.logger.warn(`zigbee-herdsman-converters:: NOT RECOGNIZED DP ` +
                            `#${dp} with data ${JSON.stringify(msg.data)} VALUE = ${value}`);
                    }
                }
            }
        },
    },
};


const tzLocal = {
    state: {
        key: ['state'],
        convertSet: async (entity, key, value, meta) => {
            await tuya.sendDataPointBool(entity, 16, value === 'ON');
        },
    },


};


const definition = {
    fingerprint: [{
        modelID: 'TS0601',
        manufacturerName: '_TZE200_eaac7dkw'
    }],
    model: 'DAC2161C',
    vendor: 'Tuya',
    extend: extend.switch(),
    description: 'DIN Rail Smart Energy Meter',
    fromZigbee: [fzLocal.tuya_xocadinrail_switch, ],
    toZigbee: [tzLocal.state],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['genBasic']);
    },
    exposes: [e.switch().setAccess('state', ea.STATE_SET), e.voltage(), e.power(), e.current(), e.energy()],
};

module.exports = definition;
