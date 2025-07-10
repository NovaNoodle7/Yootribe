module.exports = function(sequelize, Sequalize) {
    var FrontDetail = sequelize.define("FrontDetail", {
        timestamp: Sequalize.STRING,
        token: Sequalize.STRING,
        action: Sequalize.STRING,
        price: Sequalize.STRING,
        transaction: Sequalize.STRING,
        other: Sequalize.STRING
    },{
        timestamps: false
    });
    FrontDetail.associate = function(models) {
        // associations can be defined here
      };
    return FrontDetail;
}