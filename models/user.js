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
    password: Sequelize.STRING,
    premium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
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


const Order = sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    status:{
        type: Sequelize.STRING,
        allowNull: false
    },
    paymentId:{
        type: Sequelize.STRING,

    },
    orderId:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

user.hasMany(userExpense);
userExpense.belongsTo(user);


user.hasMany(Order);
Order.belongsTo(user);

module.exports = {user,userExpense,Order,sequelize};