import SearchBar from '../../search/components/SearchBar';
import Loading from '../../../components/common/Loading';
import EmptyTable from '../../../components/common/EmptyTable';
import NoResultsFound from '../../../components/common/NoResultsFound';
import Error from '../../../components/common/Error';
import useUserSearch from '../hooks/useUserSearch';
import UserTableGrid from './UserTableGrid';

const UserTable = ({
    users,
    isLoading,
    error,
    onEdit,
    onDelete,
    showCourse,
}) => {
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
                onClear={() => setSearchTerm('')}
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
