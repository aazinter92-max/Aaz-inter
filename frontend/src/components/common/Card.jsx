import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'medium',
  onClick,
  ...props 
}) => {
  const cardClasses = [
    'card',
    hover && 'card-hover',
    `card-padding-${padding}`,
    onClick && 'card-clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
