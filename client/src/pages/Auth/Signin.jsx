import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import useSignin from '@/features/auth/hooks/useSignin';
import PasswordRules from '@/components/common/PasswordRules.jsx';

const Signin = () => {
    const {
        step,
        setStep,
        email,
        setEmail,
        hasPassword,
        passwordData,
        setPasswordData,
        error,
        loading,
        handleCheckUser,
        handleAuth,
    } = useSignin();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative animate-fade-in surface-wash">
            <div className="card w-full max-w-md">
                <h1 className="text-3xl text-center mb-6 text-[var(--foreground)] font-display">
                    Welcome Back
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-2xl text-sm text-center animate-fade-in">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form
                        onSubmit={handleCheckUser}
                        className="space-y-4 animate-fade-in"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="john@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex justify-center items-center"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </form>
                ) : (
                    <form
                        onSubmit={handleAuth}
                        className="space-y-4 animate-fade-in"
                    >
                        <div className="flex items-center justify-between mb-4 text-sm text-[var(--muted)] bg-[var(--color-ink-50)] p-2 rounded-[var(--radius-sm)]">
                            <span>{email}</span>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-[var(--color-amber-600)] font-medium hover:underline"
                            >
                                Change
                            </button>
                        </div>

                        {!hasPassword && (
                            <div className="mb-4 p-3 bg-[var(--color-ink-50)] text-[var(--color-ink-700)] rounded-2xl text-sm">
                                It looks like this is your first time signing
                                in. Please set a password to continue.
                            </div>

                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {hasPassword ? 'Password' : 'New Password'}
                            </label>
                            <input
                                type="password"
                                required
                                value={passwordData.password}
                                onChange={e =>
                                    setPasswordData({
                                        ...passwordData,
                                        password: e.target.value,
                                    })
                                }
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        {!hasPassword && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={e =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    className="input-field"
                                    placeholder="••••••••"
                                />
                                <PasswordRules value={passwordData.password} />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex justify-center items-center"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : hasPassword ? (
                                'Sign In'
                            ) : (
                                'Set Password & Sign In'
                            )}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-[var(--muted)]">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="text-[var(--color-amber-600)] font-medium hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signin;
