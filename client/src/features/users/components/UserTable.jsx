import SearchBar from '../../search/components/SearchBar';
import Loading from '../../../components/common/Loading';
import EmptyTable from '../../../components/common/EmptyTable';
import NoResultsFound from '../../../components/common/NoResultsFound';
import Error from '../../../components/common/Error';
import Pagination from '../../../components/common/Pagination';
import UserTableGrid from './UserTableGrid';

const UserTable = ({
    users,
    isLoading,
    error,
    page,
    totalPages,
    onPageChange,
    searchTerm,
    setSearchTerm,
    onEdit,
    onDelete,
    showCourse,
}) => {

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

            {users.length === 0 ? (
                <NoResultsFound searchTerm={searchTerm} />
            ) : (
                <>
                    <UserTableGrid
                        users={users}
                        showCourse={showCourse}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                    <div className="mt-6 border-t border-[var(--border)] pt-4">
                        <Pagination 
                            currentPage={page || 1} 
                            totalPages={totalPages || 1} 
                            onPageChange={onPageChange} 
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default UserTable;
