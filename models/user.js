const Sequelize = require('sequelize');

const sequelize = new Sequelize('complete_expense_tracker_db','root','10031998mysql@',{
    host:'localhost',
    dialect: 'mysql'
});

const user = sequelize.define('users_list',{
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        // field: 'userId', // This specifies the column name in the database
      },
    name: Sequelize.STRING,
    email: {
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: Sequelize.STRING
})


const userExpense = sequelize.define('user', {
    id: {
        type: Sequelize.STRING, //Corrected data type to STRING
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
       // primaryKey: true,
        //autoIncrement: true,
        allowNull: false,
        // field: 'userId', // This specifies the column name in the database
      },
    money: Sequelize.STRING,
    description: Sequelize.STRING,
    category: Sequelize.STRING
}, {
    timestamps: false
});
// user.hasMany(userExpense, { foreignKey: 'userId' });
// userExpense.belongsTo(user, { foreignKey: 'userId' });
user.hasMany(userExpense);
userExpense.belongsTo(user);


module.exports = {user,userExpense};