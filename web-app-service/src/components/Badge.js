const Badge = ({
  children,
  rounded = 'full',
  textSize = 'xs',
  color,
  classes,
}) => {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded-${rounded} text-${textSize} font-medium bg-${color}-100 text-${color}-800 ${
        classes ?? ''
      }`}
    >
      {children}
    </span>
  );
};
export default Badge;
