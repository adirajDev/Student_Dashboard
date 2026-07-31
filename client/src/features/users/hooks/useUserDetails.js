import { useMemo } from 'react';

const useUserDetails = (user) => {
    const formattedData = useMemo(() => {
        if (!user) return null;

        const roleDisplay =
            user.role === 'student'
                ? 'Student'
                : user.role === 'editor'
                ? 'Editor'
                : user.role === 'collegeUser'
                ? 'College Admin'
                : user.role === 'admin'
                ? 'System Admin'
                : user.role;

        const primaryCollege = user.college?.name || user.college || 'Not Assigned';
        const primaryCourse = user.course?.name || user.course || 'Not Assigned';

        const applications = (user.applications || []).map((app) => ({
            id: app._id,
            collegeName: app.college?.name || 'Unknown College',
            courseName: app.course?.name || 'No Course Selected',
            status: app.course ? 'Active Application' : 'Pending Course Selection',
        }));

        return {
            name: user.name || 'N/A',
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
            roleDisplay,
            role: user.role,
            primaryCollege,
            primaryCourse,
            applications,
            hasApplications: applications.length > 0,
            createdAt: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                  })
                : null,
        };
    }, [user]);

    return { formattedData };
};

export default useUserDetails;
