const BadgeOutline = ({
  children,
  rounded = 'full',
  textSize = 'xs',
  color,
  colorWeight = 800,
  classes,
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-${rounded} text-${textSize} font-medium border border-${color}-${colorWeight} text-${color}-${colorWeight} ${
        classes ?? ''
      }`}
    >
      {children}
    </span>
  );
};
export default BadgeOutline;
