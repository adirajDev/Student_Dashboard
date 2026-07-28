import { MapPin, Building2 } from 'lucide-react';

const CollegeHeader = ({ college }) => {
    return (
        <div className="card mb-8 relative overflow-hidden bg-gradient-to-br from-blue-50/80 via-white to-purple-50/80 border-blue-100">
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                {college.logo && (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-2 shadow-sm border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                            src={college.logo} 
                            alt={`${college.name} logo`} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}
                
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl sm:text-4xl text-[var(--foreground)] font-bold">
                            {college.name}
                        </h1>
                        {college.type && (
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                {college.type}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[var(--ring)] mb-6 text-sm font-medium">
                        {college.location && (
                            <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                                <span>{college.location}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1.5 text-blue-500" />
                            <span>
                                Institution ID:{' '}
                                {college.collegeId || college._id.substring(0, 8)}
                            </span>
                        </div>
                    </div>

                    <div className="prose max-w-none text-[var(--foreground)] opacity-90">
                        <p>
                            {college.description ||
                                'No description available for this institution.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeHeader;
