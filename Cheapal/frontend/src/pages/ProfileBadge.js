import React from 'react';

const ProfileBadges = ({ badges, size = 'md' }) => {
    console.log("[ProfileBadges] Received badges:", badges); // Debug log

    if (!badges || !Array.isArray(badges) || badges.length === 0) {
        console.log("[ProfileBadges] No badges to render (null, not an array, or empty)");
        return null; // No badges, render nothing
    }

    const badgeColors = {
        cyan: 'bg-cyan-500/20 text-cyan-300',
        amber: 'bg-amber-500/20 text-amber-300',
        green: 'bg-green-500/20 text-green-300',
        indigo: 'bg-indigo-500/20 text-indigo-300',
        pink: 'bg-pink-500/20 text-pink-300',
        blue: 'bg-blue-500/20 text-blue-300',
        purple: 'bg-purple-500/20 text-purple-300',
        gold: 'bg-yellow-500/20 text-yellow-300', // Added for top_rated_seller
    };

    const badgeSizes = {
        sm: { container: 'gap-1 px-1.5 py-0.5 text-xs', icon: 'h-4 w-4' },
        md: { container: 'gap-1.5 px-2 py-1 text-sm', icon: 'h-7 w-7' },
    };

    const badgeIcons = {
        TrendingUpIcon: <svg className={badgeSizes[size].icon} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.414 14.586 7H12z" clipRule="evenodd" /></svg>,
        StarIcon: <svg className={badgeSizes[size].icon} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
        CheckShieldIcon: <svg className={badgeSizes[size].icon} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.41 9.687-8.165 11.256a1 1 0 01-.67 0C4.41 16.687 1 12.225 1 7c0-.68.056-1.35.166-2.001zm7.834 7.587l4.243-4.242a1 1 0 00-1.414-1.414L9.586 10.172 8.414 8.999a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0z" clipRule="evenodd" /></svg>,
        UsersGroupIcon: <svg className={badgeSizes[size].icon} fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>,
        ZapIcon: <svg className={badgeSizes[size].icon} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573L10 18.868V13H6a1 1 0 01-.82-1.573L12 1.046z" clipRule="evenodd" /></svg>,
        ShieldCheckIcon: <svg className={badgeSizes[size].icon} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.41 9.687-8.165 11.256a1 1 0 01-.67 0C4.41 16.687 1 12.225 1 7c0-.68.056-1.35.166-2.001zm7.834 7.587l4.243-4.242a1 1 0 00-1.414-1.414L9.586 10.172 8.414 8.999a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0z" clipRule="evenodd" /></svg>,
        AcademicCapIcon: <svg className={badgeSizes[size].icon} fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0L3.21 4.951 10 8.576l6.79-3.625-6.396-2.871zM2 7.693v6.667c0 .597.237 1.17.659 1.591l6.256 6.256a1 1 0 001.41 0l6.256-6.256A2.25 2.25 0 0017 13.36V6.693l-6.606 3.53a1 1 0 01-.788 0L2 7.693z" /></svg>,
    };

    return (
        <div className="inline-flex flex-wrap gap-1">
            {badges.map((badge) => {
                console.log("[ProfileBadges] Rendering badge:", badge); // Debug log
                return (
                    <div
                        key={badge.id}
                        className={`inline-flex items-center rounded-full font-semibold ${badgeColors[badge.color] || 'bg-gray-500/20 text-gray-300'} ${badgeSizes[size].container}`}
                        title={`${badge.name} (Awarded: ${new Date(badge.awardedAt).toLocaleDateString()})`}
                    >
                        {badgeIcons[badge.icon] || <span>🏅</span>}
                        <span>{badge.name}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default ProfileBadges;