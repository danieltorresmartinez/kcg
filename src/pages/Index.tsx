import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();
  return (
    <>
      <div className="lg:flex justify-center items-center h-96 font-[Alexandria] text-black pt-60">
        <div
          className="flex justify-center items-center w-5/12 h-96 text-5xl cursor-pointer hover:bg-[#f7f7f7] rounded-l-lg"
          onClick={() => navigate("/obras")}
        >
          Obras
        </div>
        <div className="w-[2px] bg-black h-[175%]"></div>
        <div
          className="flex justify-center items-center w-5/12 h-96 text-5xl cursor-pointer hover:bg-[#f7f7f7] rounded-r-lg"
          onClick={() => navigate("/estados-de-pago")}
        >
          Estados de pago
        </div>
      </div>
    </>
  );
}

export default Index;
