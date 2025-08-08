import { useNavigate } from "react-router-dom";

function Obras() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center items-center h-96 font-[Alexandria] text-black pt-64">
        <div
          className="flex justify-center items-center w-5/12 h-96 text-5xl cursor-pointer hover:bg-[#f7f7f7] rounded-l-lg"
          onClick={() => navigate("/crear-obra")}
        >
          Iniciar obra
        </div>
        <div className="w-[2px] bg-black h-3/4"></div>
        <div
          className="flex justify-center items-center w-5/12 h-96 text-5xl text-center cursor-pointer hover:bg-[#f7f7f7] rounded-r-lg"
          onClick={() => navigate("/unirse-a-obra")}
        >
          Unirse a obra en proceso
        </div>
      </div>
    </>
  );
}

export default Obras;
