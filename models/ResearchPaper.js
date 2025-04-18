const mongoose = require('mongoose');

const ResearchPaperSchema = new mongoose.Schema(
    {
            title: { type: String, required: true },
            abstract: { type: String, required: true },
            group: { type: String, required: true },
            author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            fileUrl: { type: String },
            status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
            feedback: { type: String },
            isPublic: { type: Boolean, default: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ResearchPaper", ResearchPaperSchema);
