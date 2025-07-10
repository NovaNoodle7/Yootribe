module.exports = function(sequelize, Sequalize) {
    var Front = sequelize.define("Front", {
        status: Sequalize.STRING,
        node: Sequalize.STRING,
        wallet: Sequalize.STRING,
        key: Sequalize.STRING,
        amount: Sequalize.STRING,
        percent: Sequalize.STRING,
        minbnb: Sequalize.STRING,
        maxbnb: Sequalize.STRING
    },{
        timestamps: false
    });
    Front.associate = function(models) {
        // associations can be defined here
      };
    return Front;
}