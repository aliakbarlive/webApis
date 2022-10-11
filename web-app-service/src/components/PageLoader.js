import Loader from 'react-loader-spinner';

const PageLoader = () => {
  return (
    <div className="h-screen v-screen flex items-center justify-center bg-gray-50">
      <Loader type="Oval" color="#EF4444" height={80} width={80} />
    </div>
  );
};

export default PageLoader;
