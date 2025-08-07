import { Calendar } from 'lucide-react';

const PreOrderBadge = ({ releaseDate }) => {
    // Format the release date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Calendar size={12} />
            <span>Pre-order • {formatDate(releaseDate)}</span>
        </div>
    );
};

export default PreOrderBadge;