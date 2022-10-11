const Input = ({
  id,
  name,
  value,
  onChange,
  className,
  type = 'text',
  placeholder,
  ...rest
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      className={`shadow-sm block py-1 px-2 w-full text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${className}`}
      onChange={onChange}
      {...rest}
    />
  );
};

export default Input;
