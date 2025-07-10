const { SnippingDetail, FrontDetail } = require('../models');

module.exports = {

    front(req, res) {

        FrontDetail.findAll({})
        .then(transactions => res.status(201).json({
            error: false,
            data : transactions
        }))
        .catch(error => res.json({
            error: true,
            message: error
        }));
    },

    snipping(req, res) {

        SnippingDetail.findAll({})
        .then(transactions => res.status(201).json({
            error: false,
            data : transactions
        }))
        .catch(error => res.json({
            error: true,
            message: error
        }));
    
    }

}