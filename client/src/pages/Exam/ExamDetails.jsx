import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import useExamDetails from '@/features/exam/hooks/useExamDetails';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import ExamHeader from '../../features/exam/components/ExamDetail/ExamHeader.jsx';
import ExamSidebar from '../../features/exam/components/ExamDetail/ExamSidebar.jsx';
import ExamEligibility from '../../features/exam/components/ExamDetail/ExamEligibility.jsx';
import ExamDescription from '../../features/exam/components/ExamDetail/ExamDescription.jsx';
import ExamFaqs from '@/features/exam/components/ExamDetail/ExamFaqs.jsx';
import NotFoundState from '@/components/common/NotFoundState.jsx';

const ExamDetails = () => {
    const { slug } = useParams();
    const { exam, isLoading, error, notFound, formatTimeRange } = useExamDetails(slug);
    const navigate = useNavigate();
    const { user } = useOutletContext();

    const handleApply = e => {
        if (!user) {
            e.preventDefault();
            navigate('/signin');
        }
    };

    if (isLoading) return <Loading message="Loading exam details..." />;

    if (notFound || (!error && !exam)) {
        return <NotFoundState heading="Exam" to="/exams" actionLabel="exams" />;
    }

    if (error) return <Error error={error} />;

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] animate-fade-in">
            <div className="max-w-5xl mx-auto px-6 pt-2 pb-8">
                <ExamHeader exam={exam} handleApply={handleApply} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <ExamEligibility requirement={exam.requirement} />
                    <ExamSidebar
                        exam={exam}
                        formatTimeRange={formatTimeRange}
                    />
                    <ExamDescription description={exam.examDescription} />
                    <ExamFaqs faqs={exam.faqs} />
                </div>
            </div>
        </div>
    );
};

export default ExamDetails;
