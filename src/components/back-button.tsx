/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeftCircleIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "@tanstack/react-router";

interface BackButtonProps {
  to: string;
  search?: Record<string, any>;
}

const BackButton: React.FC<BackButtonProps> = ({ to, search }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center px-4 py-2 my-4 text-white transition-colors cursor-pointer rounded-xl bg-primary hover:bg-primary-dark"
      onClick={() => navigate({ to, search: search ?? {} })} // jika search undefined, pakai {}
    >
      <button className="font-semibold">
        <ArrowLeftCircleIcon className="inline-block w-6 h-6 mr-2" />
        Kembali
      </button>
    </div>
  );
};

export default BackButton;
