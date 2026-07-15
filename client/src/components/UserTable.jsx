import SearchBar from "./SearchBar";
import Loading from "../utils/Loading";
import EmptyTable from "../utils/EmptyTable";
import NoResultsFound from "../utils/NoResultsFound";
import Error from "../utils/Error";
import useUserSearch from "../hooks/useUserSearch";
import UserTableGrid from "./UserTableGrid";

const UserTable = ({ users, isLoading, error, onEdit, onDelete, showCourse }) => {
    const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);

    // Loading
    if (isLoading) return <Loading />;

    // Error getting data
    if (error) return <Error error={error} />;

    // UI State: No users at all
    if (!users || users.length === 0) return <EmptyTable />;

    // UI State: Data Render
    return (
        <div>
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
                placeholder="Search by name or email..."
            />

            {filteredUsers.length === 0 ? (
                <NoResultsFound searchTerm={searchTerm} />
            ) : (
                <UserTableGrid
                    users={filteredUsers}
                    showCourse={showCourse}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};

export default UserTable;
