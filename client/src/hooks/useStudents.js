// import { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '@clerk/react';

// const API_URL = 'http://localhost:5000/students';
// const getStudentId = (student) => student.id || student._id;

// // TODO: Use Server-Sent Events to handle any change made by the backend
// // so the frontend table updates automatically without a manual refetch.

// const useStudents = () => {
//     const { getToken, isLoaded, isSignedIn } = useAuth();
//     const [students, setStudents] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const authFetch = useCallback(async (url, options = {}) => {
//         const token = await getToken();
//         const headers = new Headers(options.headers);

//         if (token) {
//             headers.set('Authorization', `Bearer ${token}`);
//         }

//         return fetch(url, {
//             ...options,
//             headers,
//         });
//     }, [getToken]);

//     const getErrorMessage = async (response, fallback) => {
//         try {
//             const errorData = await response.json();
//             return errorData.error || fallback;
//         } catch {
//             return fallback;
//         }
//     };

//     const fetchStudents = useCallback(async () => {
//         if (!isLoaded || !isSignedIn) {
//             setStudents([]);
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const response = await authFetch(API_URL);
//             if (!response.ok) {
//                 throw new Error(await getErrorMessage(response, 'Failed to fetch students from the server.'));
//             }

//             const data = await response.json();
//             setStudents(data);
//             setError(null);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [authFetch, isLoaded, isSignedIn]);

//     useEffect(() => {
//         // eslint-disable-next-line react-hooks/set-state-in-effect
//         fetchStudents();
//     }, [fetchStudents]);

//     // POST request to add a new student
//     const addStudent = async (newStudent) => {
//         const response = await authFetch(API_URL, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(newStudent),
//         });

//         if (!response.ok) {
//             throw new Error(await getErrorMessage(response, 'Failed to add student.'));
//         }

//         const createdStudent = await response.json();

//         setStudents((prevStudents) => {
//             const updatedList = [...prevStudents, createdStudent];
//             return updatedList.sort((a, b) => a.name.localeCompare(b.name));
//         });
//     };

//     // PUT request to update an existing student
//     const updateStudent = async (id, updatedData) => {
//         const response = await authFetch(`${API_URL}/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(updatedData),
//         });

//         if (!response.ok) {
//             throw new Error(await getErrorMessage(response, 'Failed to update student.'));
//         }

//         const updatedStudent = await response.json();

//         setStudents((prev) =>
//             prev
//                 .map((student) => (getStudentId(student) === id ? updatedStudent : student))
//                 .sort((a, b) => a.name.localeCompare(b.name))
//         );
//     };

//     // DELETE request to remove a student
//     const deleteStudent = async (id) => {
//         try {
//             const response = await authFetch(`${API_URL}/${id}`, {
//                 method: 'DELETE',
//             });

//             if (!response.ok) {
//                 throw new Error(await getErrorMessage(response, 'Failed to delete student.'));
//             }

//             setStudents((prev) => prev.filter((student) => getStudentId(student) !== id));
//         } catch (err) {
//             alert(`Error: ${err.message}`);
//         }
//     };

//     return {
//         students,
//         isLoading,
//         error,
//         addStudent,
//         updateStudent,
//         deleteStudent,
//     };
// };

// export default useStudents;
