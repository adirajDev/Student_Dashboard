import { useState } from 'react';
import { Plus } from 'lucide-react';
import NewsTable from './NewsTable';
import NewsFormModal from './NewsFormModal';
import DeleteConfirmModal from '@/components/common/DeleteConfirmModal';
import useNews from '../hooks/useNews';

const NewsManagementSection = ({ title }) => {
    const { news, isLoading, error, addNews, updateNews, deleteNews } =
        useNews(true);
    const [editingNews, setEditingNews] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingNews, setDeletingNews] = useState(null);

    return (
        <div className="mt-10 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl">{title}</h3>
                <button
                    onClick={() => {
                        setEditingNews(null);
                        setShowFormModal(true);
                    }}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add News
                </button>
            </div>

            <NewsTable
                news={news}
                isLoading={isLoading}
                error={error}
                onDelete={setDeletingNews}
                onEdit={n => {
                    setEditingNews(n);
                    setShowFormModal(true);
                }}
            />

            {showFormModal && (
                <NewsFormModal
                    editingNews={editingNews}
                    title={editingNews ? 'Edit News' : 'Add News'}
                    onAdd={addNews}
                    onUpdate={updateNews}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingNews(null);
                    }}
                />
            )}

            {deletingNews && (
                <DeleteConfirmModal
                    studentName={deletingNews.title}
                    onConfirm={async () => {
                        await deleteNews(deletingNews._id);
                        setDeletingNews(null);
                    }}
                    onClose={() => setDeletingNews(null)}
                />
            )}
        </div>
    );
};

export default NewsManagementSection;