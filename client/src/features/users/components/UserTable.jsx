import SearchBar from '../../search/components/SearchBar';
import Loading from '@/components/common/Loading';
import EmptyTable from '@/components/common/EmptyTable';
import NoResultsFound from '@/components/common/NoResultsFound';
import Error from '@/components/common/Error';
import Pagination from '@/components/common/Pagination';
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
    onViewDetails,
    showCourse,
    showCollegeOnly,
}) => {
    // UI State: Data Render
    return (
        <div>
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
                placeholder="Search by name or email..."
            />

            {isLoading ? (
                <Loading message="Loading student records.." />
            ) : error ? (
                <Error error={error} />
            ) : !users || users.length === 0 ? (
                searchTerm ? (
                    <NoResultsFound searchTerm={searchTerm} />
                ) : (
                    <EmptyTable />
                )
            ) : (
                <>
                    <UserTableGrid
                        users={users}
                        showCourse={showCourse}
                        showCollegeOnly={showCollegeOnly}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewDetails={onViewDetails}
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
