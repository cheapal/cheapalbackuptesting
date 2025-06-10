import React from 'react';

const StarRatingDisplay = ({ rating, totalReviews, iconSize = "h-5 w-5" }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const StarIconSolid = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
        </svg>
    );

    const StarIconOutline = (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.82.61l-4.725-2.885a.562.562 0 0 0-.652 0l-4.725 2.885a.562.562 0 0 1-.82-.61l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
    );

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => <StarIconSolid key={`full-${i}`} className={`${iconSize} text-yellow-400`} />)}
            {halfStar && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`${iconSize} text-yellow-400`}>
                    <path d="M12 17.27l-5.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-6.46 4.73 1.64 7.03L12 17.27zM12 14.8V4.53l-1.65 3.9L6.3 8.78l3.85 2.81-.97 4.15L12 14.8z"></path>
                </svg>
            )}
            {[...Array(emptyStars)].map((_, i) => <StarIconOutline key={`empty-${i}`} className={`${iconSize} text-yellow-400`} />)}
            {totalReviews !== undefined && <span className="ml-2 text-sm text-gray-400">({totalReviews} reviews)</span>}
        </div>
    );
};

export default StarRatingDisplay;