const LoadingMetric = ({ className }) => {
  return (
    <div
      className={`bg-white  py-4 shadow hover:shadow-xl rounded-xl ${className}`}
    >
      <div className="w-full animate-pulse mt-1">
        <div className="border-b border-gray-300 pb-4">
          <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded"></div>
          <div className="h-8 w-1/4 mx-auto bg-gray-200 rounded mt-2"></div>
          <div className="h-3 w-3/4 mx-auto bg-gray-200 rounded mt-4"></div>
        </div>

        <div className="grid grid-cols-2 gap-2 w-5/6 mx-auto mt-4">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMetric;
