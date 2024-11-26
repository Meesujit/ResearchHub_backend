const ResearchPaper = require('../models/ResearchPaper');


exports.createResearchPaper = async (req, res) => {
    try {
        const {title, abstract, authors} = req.body;
        const file = req.file.path;
        const uploadedBy = req.user.id;

        const researchPaper = new ResearchPaper({
            title,
            abstract,
            authors,
            uploadedBy,
            file
        })

        await researchPaper.save();
        res.status(201).json({message: 'Research paper submitted for approval'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }

}


exports.getAllResearchPapers = async (req, res) => {
    try {
        const researchPapers = await ResearchPaper.find().populate('uploadedBy', 'name email');

        res.status(200).json({researchPapers});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


exports.getUserResearchPapers = async (req, res) => {
    try {
        const researchPapers = await ResearchPaper.find({ uploadedBy: req.user._id });
        res.status(200).json(researchPapers); // Ensure this includes the 'status' field
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch research papers' });
      }
};

exports.updateResearchPaperStatus = async (req, res) => {
    try {
      const { status } = req.body; // Ensure this matches 'Approved'
      const researchPaper = await ResearchPaper.findById(req.params.id);
  
      if (!researchPaper) {
        return res.status(404).json({ message: 'Research paper not found' });
      }
  
      researchPaper.status = status; // Update the status field
      researchPaper.updatedAt = Date.now();
      await researchPaper.save();
  
      res.status(200).json({ message: 'Research paper status updated', paper: researchPaper });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.updateResearchPaper = async (req, res) => {
    try {
        const researchPaper = await ResearchPaper.findById(req.params.id);

        if(!researchPaper){
            return res.status(404).json({message: 'Research paper not found'});
        }

        if(researchPaper.uploadedBy.toString() !== req.user.id){
            return res.status(403).json({error: 'Unauthorized to update this paper wait for approval'});
        }

        const updates = req.body;
        Object.keys(researchPaper, updates, {updatedAt: Date.now()});

        res.status(200).json({message: 'Research paper updated', researchPaper});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


exports.deleteResearchPaper = async (req, res) => {
    try {
        const researchPaper = await ResearchPaper.findById(req.params.id);

        if(!researchPaper){
            return res.status(404).json({message: 'Research paper not found'});
        }

        if(req.user.isAdmin || researchPaper.uploadedBy.toString() === req.user.id){
            await researchPaper.remove();
            return res.status(200).json({message: 'Research paper deleted'});
        }

        res.status(403).json({error: 'Unauthorized to delete this paper'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}