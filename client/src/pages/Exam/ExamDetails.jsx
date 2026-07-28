import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import useExamDetails from '../../features/exam/hooks/useExamDetails';
import Loading from '../../components/common/Loading';
import Error from '../../components/common/Error';
import ExamHeader from './ExamHeader';
import ExamSidebar from './ExamSidebar';
import ExamEligibility from './ExamEligibility';
import ExamDescription from './ExamDescription';

const ExamDetails = () => {
    const { id } = useParams();
    const { exam, isLoading, error, formatTimeRange } = useExamDetails(id);
    const navigate = useNavigate();
    const { user } = useOutletContext();

    const handleApply = e => {
        if (!user) {
            e.preventDefault();
            navigate('/signin');
        }
    };

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!exam) return <Error error="Exam not found" />;

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
                </div>
            </div>
        </div>
    );
};

export default ExamDetails;
