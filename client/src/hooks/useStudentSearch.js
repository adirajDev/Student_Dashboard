import { useState, useMemo } from 'react';

// Filters a student list by name (case-insensitive, substring match)
const useStudentSearch = (students) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        const term = searchTerm.trim().toLowerCase();
        if (!term) return students;
        return students.filter((student) =>
            student.name?.toLowerCase().includes(term)
        );
    }, [students, searchTerm]);

    return { searchTerm, setSearchTerm, filteredStudents };
};

export default useStudentSearch;