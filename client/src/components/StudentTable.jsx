import SearchBar from "./SearchBar";
import Loading from "../utils/Loading";
import EmptyTable from "../utils/EmptyTable";
import NoResultsFound from "../utils/NoResultsFound";
import Error from "../utils/Error";
import useStudentSearch from "../hooks/useStudentSearch";
import StudentTableGrid from "./StudentTableGrid";

const StudentTable = ({ students, isLoading, error, onEdit, onDelete }) => {
    const { searchTerm, setSearchTerm, filteredStudents } = useStudentSearch(students);

    // Loading
    if (isLoading) return <Loading />

    // Error getting data
    if (error) return <Error error={error} />

    // UI State: No students at all
    if (!students || students.length === 0) return <EmptyTable />

    // UI State: Data Render
    return (
        <div>
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
                placeholder="Search by student name..."
            />

            {filteredStudents.length === 0 ? (
                <NoResultsFound searchTerm={searchTerm} />
            ) : (
                <StudentTableGrid
                    students={filteredStudents}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};

export default StudentTable;
