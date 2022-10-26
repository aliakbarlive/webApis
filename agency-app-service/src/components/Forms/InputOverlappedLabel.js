const InputOverlappedLabel = ({
  label,
  name,
  placeholder,
  type = 'text',
  value,
  onChange,
  required,
}) => {
  return (
    <div className="relative border border-gray-300 rounded-md px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-red-600 focus-within:border-red-600">
      <label
        htmlFor="name"
        className="absolute -top-2 left-2 -mt-px inline-block px-1 bg-white text-xs font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
export default InputOverlappedLabel;
