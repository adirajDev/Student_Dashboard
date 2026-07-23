import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Monitor, Book, GraduationCap, Link as LinkIcon, ChevronLeft, Building } from 'lucide-react';
import useExams from '../../features/exam/hooks/useExams';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';

const ExamDetails = () => {
    const { id } = useParams();
    const { getExamById } = useExams(false);
    
    const [exam, setExam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExamDetails = async () => {
            setIsLoading(true);
            const res = await getExamById(id);
            if (res.success) {
                setExam(res.data);
            } else {
                setError(res.error || 'Failed to load exam details');
            }
            setIsLoading(false);
        };

        if (id) {
            fetchExamDetails();
        }
    }, [id]);

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!exam) return <Error error="Exam not found" />;

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] animate-fade-in">
            {/* Top Navigation Bar */}
            <div className="bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-40 shadow-sm backdrop-blur-md bg-opacity-90">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        to="/search"
                        className="inline-flex items-center text-sm font-medium text-[var(--ring)] hover:text-[var(--foreground)] transition-colors gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Search
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 mb-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-bl-full -z-10"></div>
                    
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                            <Book className="w-10 h-10" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-extrabold text-[var(--foreground)] mb-2 tracking-tight">
                                {exam.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium mt-4">
                                {exam.examMode === 'Online' ? (
                                    <span className="px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full flex items-center gap-2">
                                        <Monitor className="w-4 h-4" /> Online Test
                                    </span>
                                ) : (
                                    <span className="px-3 py-1.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full flex items-center gap-2">
                                        <Building className="w-4 h-4" /> Offline Center
                                    </span>
                                )}
                                <span className="px-3 py-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(exam.regStartingDate).toLocaleDateString()} - {new Date(exam.regEndingDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Book className="w-6 h-6 text-indigo-500" />
                                About the Exam
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-[var(--foreground)]">
                                <p className="whitespace-pre-line leading-relaxed text-lg">
                                    {exam.examDescription}
                                </p>
                            </div>
                        </div>

                        {/* Eligibility */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <GraduationCap className="w-6 h-6 text-emerald-500" />
                                Eligibility Criteria
                            </h2>
                            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl">
                                <p className="whitespace-pre-line text-[var(--foreground)] font-medium text-lg leading-relaxed">
                                    {exam.requirement}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Important Dates */}
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-6 pb-4 border-b border-[var(--border)]">
                                Important Dates
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-bold uppercase">{new Date(exam.regStartingDate).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-lg font-black leading-none">{new Date(exam.regStartingDate).getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--foreground)]">Registration Opens</h4>
                                        <p className="text-sm text-[var(--ring)]">{new Date(exam.regStartingDate).getFullYear()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex flex-col items-center justify-center shrink-0">
                                        <span className="text-xs font-bold uppercase">{new Date(exam.regEndingDate).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-lg font-black leading-none">{new Date(exam.regEndingDate).getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--foreground)]">Registration Closes</h4>
                                        <p className="text-sm text-[var(--ring)]">{new Date(exam.regEndingDate).getFullYear()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 shadow-lg text-white">
                            <h3 className="text-xl font-bold mb-2">Ready to apply?</h3>
                            <p className="text-indigo-100 mb-6 text-sm">
                                Make sure you meet all the eligibility criteria before starting your application process.
                            </p>
                            {exam.examLink ? (
                                <a 
                                    href={exam.examLink.startsWith('http') ? exam.examLink : `https://${exam.examLink}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-white text-indigo-700 hover:bg-slate-50 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    Official Website
                                </a>
                            ) : (
                                <div className="w-full bg-white/20 text-white font-semibold py-3 px-4 rounded-xl text-center backdrop-blur-sm cursor-not-allowed">
                                    Link Unavailable
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamDetails;
