const FIELD_HANDLERS = {
    name: (college, value) => { college.name = value; },
    description: (college, value) => { college.description = value; },
    logo: (college, value) => { college.logo = value; },
    type: (college, value) => { college.type = value; },
    location: (college, value) => { college.location = value; },
    availableCourses: (college, value) => { college.availableCourses = value; },
    courseUpdates: (college, value) => {
        let currentCourses = [...(college.availableCourses || [])];
        
        if (value.removed && value.removed.length > 0) {
            currentCourses = currentCourses.filter(c => 
                !value.removed.includes(c.course.toString())
            );
        }
        
        if (value.updated && value.updated.length > 0) {
            value.updated.forEach(update => {
                const existing = currentCourses.find(c => c.course.toString() === update.course.toString());
                if (existing) existing.fee = update.fee;
            });
        }
        
        if (value.added && value.added.length > 0) {
            value.added.forEach(addition => {
                if (!currentCourses.some(c => c.course.toString() === addition.course.toString())) {
                    currentCourses.push(addition);
                }
            });
        }
        
        college.availableCourses = currentCourses;
    },
    recruiters: (college, value) => { college.recruiters = value; },
    faculty: (college, value) => { college.faculty = value; },

    overview: (college, value) => {
        college.overview = value === '' ? null : value;
    },

    collegeId: (college, value) => {
        college.collegeId = value === '' ? undefined : value;
    },

    placementDetails: (college, value) => {
        if (!college.placementDetails) college.placementDetails = {};
        for (const [key, val] of Object.entries(value)) {
            college.placementDetails[key] =
                key === 'placementPercentage' && val === '' ? null : val;
        }
    },
};

export const applyProposedChanges = (college, changes) => {
    for (const [field, value] of Object.entries(changes)) {
        const handler = FIELD_HANDLERS[field];
        if (handler) handler(college, value);
    }
};