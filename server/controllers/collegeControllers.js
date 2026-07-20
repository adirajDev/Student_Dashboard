import College from "../models/College.js";
import Rating from "../models/Rating.js";

export const getColleges = async (req, res) => {
    try {
        const colleges = await College.find({}).sort({ name: 1 });
        res.json(colleges);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id).populate('availableCourses');
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.json(college);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createCollege = async (req, res) => {
    try {
        const { name, location, description, collegeId, availableCourses} = req.body;

        if (!name) {
            return res.status(400).json({message: "Name is required"});
        }

        const existingCollege = await College.findOne({ name })
        if (existingCollege) {
            return res.status(400).json({message: "College already exists"});
        }

        const college = new College({
            name,
            location,
            description,
            collegeId,
            availableCourses
        })

        await college.save()
        return res.status(201).json({message: "College created successfully", college})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'A college with this name or ID already exists.' });
        }
        return res.status(500).json({message: error.message});
    }
}

export const updateCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;
        
        // Prevent manual override of computed rating fields
        const updateData = { ...req.body };
        delete updateData.averageRating;
        delete updateData.totalRatings;

        const college = await College.findByIdAndUpdate(
            collegeId, 
            updateData, 
            { returnDocument: 'after', runValidators: true } // new: true returns the updated document
        ).populate('availableCourses', 'name level');

        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }

        res.status(200).json(college);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'College name or ID must be unique.' });
        }
        res.status(500).json({ error: error.message });
    }
};

export const deleteCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;

        const college = await College.findByIdAndDelete(collegeId);
        if (!college) {
            return res.status(404).json({message: "College not found"});
        }

        await Rating.deleteMany({ college: collegeId });
        
        return res.status(200).json({message: "College deleted successfully"})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}