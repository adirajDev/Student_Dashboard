import { MapPin, Building2 } from 'lucide-react';

const CollegeHeader = ({ college }) => {
    return (
        <div className="card mb-8 relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-4xl text-[var(--foreground)] mb-2">{college.name}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-[var(--ring)] mb-6">
                    {college.location && (
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                            <span>{college.location}</span>
                        </div>
                    )}
                    <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 text-blue-500" />
                        <span>Institution ID: {college.collegeID || college._id.substring(0, 8)}</span>
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-[var(--foreground)] opacity-90">
                    <p>{college.description || "No description available for this institution."}</p>
                </div>
            </div>
        </div>
    );
};

export default CollegeHeader;
