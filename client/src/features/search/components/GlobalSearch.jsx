import SearchBar from './SearchBar';
import useGlobalSearchInput from '../hooks/useGlobalSearchInput';

const GlobalSearch = () => {
    const { inputValue, handleSearch, handleContainerClick } = useGlobalSearchInput();

    return (
        <div className="relative w-full max-w-xl mx-4">
            <div onClick={handleContainerClick}>
                <SearchBar
                    value={inputValue}
                    onChange={handleSearch}
                    onClear={() => handleSearch('')}
                    placeholder="Search courses and colleges..."
                />
            </div>
        </div>
    );
};

export default GlobalSearch;
