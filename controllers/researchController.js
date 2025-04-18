const ResearchPaper = require("../models/ResearchPaper");

// ✅ Submit a research paper (User)
exports.submitPaper = async (req, res) => {
    try {
        const { title, abstract, group, fileUrl, isPublic } = req.body;

        if (!title || !abstract || !group) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newPaper = new ResearchPaper({
            title,
            abstract,
            group,
            fileUrl: fileUrl || "",
            isPublic: isPublic || false,
            author: req.user._id,
            status: "Pending",
            feedback: ""
        });

        await newPaper.save();
        res.status(201).json({ message: "Research paper submitted successfully.", paper: newPaper });
    } catch (error) {
        console.error("Error submitting research paper:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// ✅ Fetch all research papers (Admin only)
exports.getAllPapers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const papers = await ResearchPaper.find().populate("author", "username email");
        res.json(papers);
    } catch (error) {
        console.error("Error fetching research papers:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// ✅ Get public research papers (For guests)
exports.getPublicPapers = async (req, res) => {
    try {
        const papers = await ResearchPaper.find({ isPublic: true, status: "Approved",  }).populate("author", "username");
        res.json(papers);
    } catch (error) {
        console.error("Error fetching public research papers:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// ✅ Get user-specific research papers
exports.getUserPapers = async (req, res) => {
    try {
        const papers = await ResearchPaper.find().populate("author", "username email");
        res.json(papers);

    } catch (error) {
        console.error("Error fetching user research papers:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// ✅ Approve a research paper (Admin)
exports.approvePaper = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const paper = await ResearchPaper.findByIdAndUpdate(
            req.params.id,
            { status: "Approved", feedback: "" },
            { new: true }
        );

        if (!paper) return res.status(404).json({ message: "Research paper not found." });

        res.json({ message: "Research paper approved.", paper });
    } catch (error) {
        console.error("Error approving research paper:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// ✅ Reject a research paper with feedback (Admin)
exports.rejectPaper = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const { feedback } = req.body;

        if (!feedback) {
            return res.status(400).json({ message: "Feedback is required for rejection." });
        }

        const paper = await ResearchPaper.findByIdAndUpdate(
            req.params.id,
            { status: "Rejected", feedback },
            { new: true }
        );

        if (!paper) return res.status(404).json({ message: "Research paper not found." });

        res.json({ message: "Research paper rejected.", paper });
    } catch (error) {
        console.error("Error rejecting research paper:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.updatePaper = async (req, res) => {
    try {
        const paperId = req.params.id;
        const { title, abstract, fileUrl } = req.body;

        const paper = await ResearchPaper.findByIdAndUpdate({ _id: paperId, author: req.user._id });

        if (!paper) return res.status(404).json({ message: "Research paper not found or unauthorized." });

        // ✅ Only allow updates if paper is approved
        if (paper.status !== "Approved") {
            return res.status(403).json({ message: "Only approved papers can be updated." });
        }

        // ✅ Update the fields
        if (title) paper.title = title;
        if (abstract) paper.abstract = abstract;
        if (fileUrl) paper.fileUrl = fileUrl;

        await paper.save();
        res.status(200).json({ message: "Research paper updated successfully.", paper });

    } catch (error) {
        console.error("Error updating research paper:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



exports.deletePaper = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the paper by ID
        const paper = await ResearchPaper.findById(id);

        if (!paper) {
            return res.status(404).json({ message: "Research paper not found." });
        }

        // Check if the logged-in user is the author
        if (paper.author.toString() !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized: You can only delete your own research papers." });
        }

        // Only allow deletion if status is "Approved"
        if (paper.status !== "Approved") {
            return res.status(403).json({ message: "Only approved papers can be deleted." });
        }

        // Delete the paper
        await ResearchPaper.findByIdAndDelete(id);

        res.json({ message: "Research paper deleted successfully." });

    } catch (error) {
        console.error("Error deleting research paper:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

