import type { ReactNode } from "react";

const Header = ({ title }: { title: ReactNode }) => (
  <div className="flex items-center justify-between w-full mb-1 text-lg font-semibold">
    {typeof title === "string" ? <h3>{title}</h3> : title}
  </div>
);

export default Header;
