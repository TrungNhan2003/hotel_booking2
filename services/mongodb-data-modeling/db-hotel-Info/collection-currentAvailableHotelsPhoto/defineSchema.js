const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    thumbnail: {
        height: { type: Number },
        width: { type: Number },
        url: { type: String }
    },
    small: {
        height: { type: Number },
        width: { type: Number },
        url: { type: String }
    },
    medium: {
        height: { type: Number },
        width: { type: Number },
        url: { type: String }
    },
    large: {
        height: { type: Number },
        width: { type: Number },
        url: { type: String }
    },
    original: {
        height: { type: Number },
        width: { type: Number },
        url: { type: String }
    }
});

const sourceSchema = new Schema({
    name: { type: String },
    localized_name: { type: String }
});

const photoSchema = new Schema({
    id: { type: Number, required: true },
    is_blessed: { type: Boolean, required: true },
    caption: { type: String, required: true },
    published_date: { type: Date, required: true },
    images: { type: imageSchema, required: true },
    album: { type: String, required: true },
    source: { type: sourceSchema, required: true }
});

