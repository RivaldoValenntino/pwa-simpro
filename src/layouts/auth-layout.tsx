import React from "react";
import NavigationBar from "../components/navigation-bar";
import Profile from "../components/ui/profile";
import ShiftInfo from "../components/shift-info";
import Avatar from "../assets/ic_akun_avatar.svg";
import { useAuthStore } from "../store/auth";
import { useQuery } from "@tanstack/react-query";
import { fetchLastActivity } from "../queries/dashboard/fetch-last-activity";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const auth = useAuthStore();
  const { data: LastActivityData } = useQuery(fetchLastActivity(auth.user?.id));

  const formatTanggalIndo = (tgl: string | undefined): string => {
    if (!tgl) return "-";
    const bulanIndo = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const [tahun, bulan, hari] = tgl.split("-");
    return `${parseInt(hari)} ${bulanIndo[parseInt(bulan) - 1]} ${tahun}`;
  };

  const lastTgl = LastActivityData?.data?.tgl || "";

  const waktu = LastActivityData?.data?.jam; // "2025-07-21 21:30:44"

  const tanggalAktivitas =
    lastTgl && waktu ? `${formatTanggalIndo(lastTgl)}, ${waktu}` : "-";

  return (
    <div className="z-10 flex items-center justify-center">
      <div
        id="index-body"
        className="relative w-full max-w-3xl min-h-full px-4 pb-20 mx-auto h-dvh"
      >
        <div className="circle-decoration-right"></div>
        <div className="circle-decoration-left"></div>

        <Profile
          cabang={auth.user?.nama_installasi}
          nama={auth.user?.nama}
          avatar={Avatar}
        />

        <ShiftInfo
          shift={auth.user?.nama_shift}
          tanggal={tanggalAktivitas}
          group={auth.user?.nama_group}
        />

        <div className="relative z-2">{children}</div>

        <NavigationBar />
      </div>
    </div>
  );
};

export default AuthLayout;
