const mongoose = require('mongoose');


const researchPaperSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    authors: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending'
    },
    file: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }, 
    updateAt: {
        type: Date,
        default: Date.now
    }

})

const ResearchPaper = mongoose.model('ResearchPaper', researchPaperSchema);

module.exports = ResearchPaper;