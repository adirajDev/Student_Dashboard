export const getApplicationColleges = user => 
    (user?.applications || [])
        .map(app => app.college)
        .filter(Boolean)
        .filter(
            (c, i, arr) => 
                arr.findIndex(x => (x._id || x) === (c._id || c)) === i
        );

export const canReviewCollege = (user, collegeId) =>
    user?.role === 'student' &&
        getApplicationColleges(user).some(c => (c._id || c) === collegeId)
