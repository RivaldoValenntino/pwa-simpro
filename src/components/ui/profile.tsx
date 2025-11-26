import React from "react";

type ProfileProps = {
  avatar?: string;
  cabang: string | undefined;
  nama: string | undefined;
  className?: string;
};

const Profile: React.FC<ProfileProps> = ({
  avatar,
  cabang,
  nama,
  className,
}) => {
  return (
    <div
      className={`p-4 rounded-md flex items-center space-x-4 w-max ${className}`}
    >
      <div className="flex items-center justify-center overflow-hidden bg-white rounded-full w-14 h-14">
        {avatar ? (
          <img src={avatar} alt={nama} className="object-cover w-full h-full" />
        ) : null}
      </div>
      <div>
        <p className="text-sm text-white">{cabang}</p>
        <p className="text-lg font-bold text-white">{nama}</p>
      </div>
    </div>
  );
};

export default Profile;
