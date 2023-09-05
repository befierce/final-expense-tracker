const db = require('../util/database');
const User = require('../models/user.js');


exports.postDataToTheServer = (req, res, next) => {
    const { id, money, description, category } = req.body;

    User.create({
        id: id,
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

exports.getAllDataFromServer = (req, res, next) => {
    User.findAll()
        .then((result) => {
            res.json(result); // Send the result to the client
        })
        .catch((err) => {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error fetching data' });
        });
}

exports.getSingleDataFromServer = (req, res, next) => {
    const id = req.params.id;

    User.findByPk(id)
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

exports.deleteDataFromServer = (req, res, next) => {
    const id = req.params.id;

    User.destroy({
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
