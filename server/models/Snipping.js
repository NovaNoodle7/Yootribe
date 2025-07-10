'use strict';
module.exports = function(sequelize, Sequalize) {
    var Snipping = sequelize.define("Snipping", {
        status: Sequalize.STRING,
        node: Sequalize.STRING,
        wallet: Sequalize.STRING,
        key: Sequalize.STRING,
        token: Sequalize.STRING,
        amount: Sequalize.STRING,
        slippage: Sequalize.STRING,
        gasprice: Sequalize.STRING,
        gaslimit: Sequalize.STRING
    },{
        timestamps: false
    });
    Snipping.associate = function(models) {
        // associations can be defined here
      };
    return Snipping;
}