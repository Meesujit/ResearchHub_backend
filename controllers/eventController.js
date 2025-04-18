const Event = require('../models/Event');


// create an event ( admin only )
exports.createEvent = async (req, res) => {
    try{
        const {name, description, date, location, image, isPublic} = req.body;
        if(!name || !description || !date || !location || !image){
            return res.status(400).json({ message: "All fields are required." });
        }

        const newEvent = new Event({
            name,
            description,
            date,
            location,
            image,
            createdBy: req.user._id,
            isPublic: isPublic || false,
        });


        await newEvent.save();
        res.status(201).json({message: "New event created", event: newEvent});
    }catch (error){
        console.error("Error in creating event",error);
        res.status(500).json({ error: 'Error creating event.' });
    }
}

// get all event ( admin only )
exports.getAllEvents = async (req, res) => {
    try{
        const events = await Event.find().populate('createdBy', 'name email');
        res.status(200).json(events);
    }catch (error){
        console.error("Error in getting events",error);
        res.status(500).json({ error: 'Error getting events' });
    }
}

// get event for logged-in user
exports.getUserEvents = async (req, res) => {
    try{
        const events = await Event.find({participants: req.user._id}).populate('createdBy', 'name email');
        res.status(200).json(events);
    }catch (error){
        console.log("Error in getting user events",error);
        res.status(500).json({ error: 'Error getting user events' });
    }
}

exports.publicEvents = async (req, res) => {
    try{
        const events = await Event.find({isPublic: true}).populate("name date");
        res.status(200).json(events);
    }catch (error){
        console.error("Error in public events",error);
        res.status(500).json({ error: 'Error getting public events' });
    }
}

// update event admin only
exports.updateEvent = async (req, res) => {
    try {
        const {id} = req.params;
        const events = await Event.findByIdAndUpdate(id, req.body, {new: true});

        if (!events) return res.status(404).json({message: "No event found."});

        res.status(200).json({message: "Event updated successfully", events});
    }catch (error){
        console.log('Error in update event',error);
        res.status(500).json({error: 'Error updating event',});
    }
}


// delete event admin only
exports.deleteEvent = async (req, res) => {
    try{
        const {id} = req.params;
        const events = await Event.findByIdAndDelete(id);

        if (!events) return res.status(404).json({message: "No event found."});

        res.status(200).json({message: "Event deleted successfully", events});
    }catch (error){
        console.log('Error in delete event',error);
        res.status(500).json({error: 'Error delete event'});
    }
}

// participate in event user only
exports.participateInEvent = async (req, res) => {
    try{
        const {id} = req.params;
        const userId = req.user._id;

        console.log(userId);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID not found." });
        }


        const event = await Event.findById(id);

        if (!event) return res.status(404).json({message: "No event found."});

        if(event.participants.includes(userId)){
            return res.status(200).json({message: "User participated successfully",event});
        }

        event.participants.push(userId);
        await event.save();

        res.status(200).json({message: "Event participated successfully",event});
    }catch (error){
        console.error("Error in participating event",error);
        res.status(500).json({error: 'Error participating event'});
    }
}