const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bankSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mono_account_id: {
        type: String,
        required: true
    },
    mono_code: {
        type: String,
        required: true
    },
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;