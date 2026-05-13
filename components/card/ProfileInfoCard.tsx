import { format } from "date-fns";
import { id as localeId } from "date-fns/locale/id";
import { UserProfile } from "@/types";
import { JSX } from "react";

type Props = {
  user: UserProfile;
};

export function ProfileInfoCard({ user }: Props): JSX.Element {
  const joinedAt = format(new Date(user.created_at), "d MMMM yyyy", {
    locale: localeId,
  });
  return (
    <div className="rounded-2xl border border-stone-100 bg-white shadow-sm px-5 py-2">
      <InfoRow label="Nama lengkap" value={user.name} />
      <InfoRow label="Email" value={user.email} mono />
      <InfoRow label="Nomor HP" value={user.phone ? user.phone : null} mono />
      <InfoRow label="Bergabung" value={joinedAt} />
      <InfoRow label="ID Akun" value={user.id} mono />
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-stone-50 last:border-0">
      <span className="text-sm text-stone-500 shrink-0 w-28">{label}</span>
      <span
        className={`text-sm text-stone-800 font-medium text-right ${
          mono ? "font-mono" : ""
        }`}
      >
        {value ?? (
          <span className="text-stone-300 font-normal">Belum diisi</span>
        )}
      </span>
    </div>
  );
}
