export const DASHBOARD_BY_ROLE = {
    admin: {
        label: 'Admin Panel',
        path: '/admin/dashboard',
        defaultTab: 'overview',
    },
    editor: {
        label: 'Editor Panel',
        path: '/admin/dashboard',
        defaultTab: 'overview',
    },
    college: {
        label: 'College Panel',
        path: '/college/dashboard',
        defaultTab: 'edit',
    },
    blogger: {
        label: 'Blogger Studio',
        path: '/blogger/dashboard',
        defaultTab: 'write',
    },
    student: {
        label: 'Student Portal',
        path: '/dashboard',
        defaultTab: 'overview',
    },
};

export const getDashboard = role =>
    DASHBOARD_BY_ROLE[role] ?? DASHBOARD_BY_ROLE.student;
