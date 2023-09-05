// const db = require('../util/database');
const { user, userExpense } = require('../models/user');


exports.postExpenseDataToTheServer = (req, res, next) => {
    const { id, userId, money, description, category } = req.body;

    userExpense.create({
        id: id,
        userId: userId, 
        money: money,
        description: description,
        category: category
    })
    .then((result) => {
        const responseData = result.toJSON(); // Convert the result to JSON
        res.json(responseData);
    })
    .catch((err) => {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Error inserting data' });
    });
}

exports.getExpenseDataFromTheServer = (req, res, next) => {
    userExpense.findAll()
        .then((result) => {
            res.json(result); // Send the result to the client
        })
        .catch((err) => {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
        });
}

exports.getSingleExpenseDataFromTheServer = (req, res, next) => {
    const id = req.params.id;

    userExpense.findByPk(id)
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(userData);
        })
        .catch((err) => {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
        });
}

exports.deleteSingleExpenseDataFromTheServer = (req, res, next) => {
    const id = req.params.id;

    userExpense.destroy({
        where: { id: id }
    })
    .then(() => {
        res.json({ userId: id, message: 'Data deleted successfully' });
    })
    .catch((err) => {
        console.error('Error deleting data:', err);
        res.status(500).json({ error: 'Error deleting data' });
    });
}
