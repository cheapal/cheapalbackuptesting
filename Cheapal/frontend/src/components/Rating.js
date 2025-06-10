import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#FFD700', small = false }) => {
  const size = small ? 'text-sm' : 'text-base';
  
  return (
    <div className={`flex items-center ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? (
            <FaStar color={color} />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt color={color} />
          ) : (
            <FaRegStar color={color} />
          )}
        </span>
      ))}
      <span className={`ml-1 text-gray-600 dark:text-gray-300 ${small ? 'text-xs' : 'text-sm'}`}>
        {text && text}
      </span>
    </div>
  );
};

export default Rating;