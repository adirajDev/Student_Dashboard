import { Settings, X, Loader2 } from 'lucide-react';
import useSettings from '../hooks/useSettings';
import { createPortal } from 'react-dom';

const SettingsModal = ({ user, onClose, onUpdate }) => {
    const { formData, handleChange, handleSubmit, error, success, loading } =
        useSettings(user, onUpdate, onClose);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-[var(--card)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-[var(--border)]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
                    <h2 className="text-xl flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-500" />
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-900 items-start">
                        <div>
                            <span className="block text-slate-500 mb-1">
                                Name
                            </span>
                            {user.name}
                        </div>
                        <div>
                            <span className="block text-slate-500 mb-1">
                                Phone
                            </span>
                            {user.phone}
                        </div>
                        {user.course && (
                            <div className="sm:col-span-2">
                                <span className="block text-slate-500 mb-1">
                                    Course
                                </span>
                                {user.course?.name || user.course}
                            </div>
                        )}
                        {user.college && (
                            <div className="sm:col-span-2">
                                <span className="block text-slate-500 mb-1">
                                    College
                                </span>
                                {user.college?.name || user.college}
                            </div>
                        )}
                    </div>

                    <hr className="my-6 border-slate-200" />

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-2xl text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-2xl text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email / Username
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>

                        <div className="border-t border-[var(--border)] pt-4 mt-4">
                            <h3 className="text-sm mb-3">Change Password</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-24 flex justify-center items-center"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SettingsModal;
