import { useState, useMemo } from 'react';

// const useUserSearch = (users) => {
//     const [searchTerm, setSearchTerm] = useState("");

//     const filteredUsers = useMemo(() => {
//         if (!searchTerm.trim()) return users;

//         const lowercasedSearch = searchTerm.toLowerCase();

//         return users.filter((user) =>
//             user.name.toLowerCase().includes(lowercasedSearch) ||
//             user.email.toLowerCase().includes(lowercasedSearch)
//         );
//     }, [searchTerm, users]);

//     return {
//         searchTerm,
//         setSearchTerm,
//         filteredUsers
//     };
// };

const useUserSearch = users => {
    const [searchTerm, setSearchTerm] = useState('');

    // React Compiler automatically memoizes this block behind the scenes
    let filteredUsers = users;

    if (searchTerm.trim()) {
        const lowercasedSearch = searchTerm.toLowerCase();

        filteredUsers = users.filter(
            user =>
                user.name.toLowerCase().includes(lowercasedSearch) ||
                user.email.toLowerCase().includes(lowercasedSearch)
        );
    }

    return {
        searchTerm,
        setSearchTerm,
        filteredUsers,
    };
};

export default useUserSearch;
