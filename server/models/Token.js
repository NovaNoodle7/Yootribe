module.exports = function(sequelize, Sequalize) {
    var Token = sequelize.define("Token", {
        name: Sequalize.STRING,
        symbol: Sequalize.STRING,
        address: Sequalize.STRING,
        actions : Sequalize.STRING
    },{
        timestamps: false
    });
    Token.associate = function(models) {
        // associations can be defined here
      };
    return Token;
}