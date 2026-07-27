const FIELD_HANDLERS = {
    name: (college, value) => { college.name = value; },
    description: (college, value) => { college.description = value; },
    logo: (college, value) => { college.logo = value; },
    type: (college, value) => { college.type = value; },
    location: (college, value) => { college.location = value; },
    availableCourses: (college, value) => { college.availableCourses = value; },
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