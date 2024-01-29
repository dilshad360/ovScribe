import Image from "next/image";
import LoaderGif from "@/components/assets/tail.svg";


const Loader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-[#f8f7f4] ">
      <div className="relative flex justify-center items-center w-60 h-60 ">
        <Image src={LoaderGif}  ></Image>
      </div>
    </div>
  );
};

export default Loader;
