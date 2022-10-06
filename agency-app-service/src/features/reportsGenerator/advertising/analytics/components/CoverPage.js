import logo from 'assets/images/siLogo.png';

const CoverPage = () => {
  return (
    <div
      style={{ height: '1050px' }}
      className="flex flex-col justify-between w-full font-body break-after-always bg-custom-pink"
    >
      <div className="w-full mt-16">
        <div className="flex justify-between ml-14 items-center w-28">
          <img src={logo} className="h-15 w-15" />
          <p className="font-black text-2xl text-white ml-4 leading-5">
            Seller Interactive.
          </p>
        </div>
        <hr className="ml-14 mt-8" />
      </div>

      <p
        className="font-bold text-5xl text-white ml-10 mb-32"
        style={{ lineHeight: '60px' }}
      >
        PPC <br /> Performance <br /> Report
      </p>
    </div>
  );
};

export default CoverPage;
