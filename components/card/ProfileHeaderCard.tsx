import {UserProfile} from "@/types";

type Props = {
    user: UserProfile;
}

const ROLE_MAP: Record<UserProfile["role"], { label: string; emoji: string; desc: string }> = {
    finder: {
        label: "Penemu",
        emoji: "🔍",
        desc: "Melaporkan orang yang ditemukan",
    },
    seeker: {
        label: "Pencari",
        emoji: "❤️",
        desc: "Mencari anggota keluarga yang hilang",
    },
    volunteer: {
        label: "Relawan",
        emoji: "🤝",
        desc: "Membantu koordinasi dan verifikasi laporan",
    },
};
export function ProfileHeaderCard({user}: Props) {
    const roleInfo = ROLE_MAP[user.role];

    return (
        <div className="rounded-2xl border border-stone-100 bg-white shadow-sm p-6">
            <div className="flex items-center gap-4 mb-5">
                <Avatar name={user.name} />
                <div className="min-w-0">
                    <h1 className="text-lg font-bold text-stone-900 truncate">
                        {user.name}
                    </h1>
                    <p className="text-sm text-stone-500 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-orange-50 rounded-full px-3 py-1">
                        <span className="text-base leading-none">{roleInfo.emoji}</span>
                        <span className="text-xs font-semibold text-orange-700">
                                    {roleInfo.label}
                                </span>
                    </div>
                </div>
            </div>

            {/* Role description */}
            <div className="rounded-xl bg-stone-50 px-4 py-3 text-sm text-stone-500 leading-relaxed">
                {roleInfo.desc}
            </div>
        </div>
    )
}

function Avatar({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shrink-0">
            <span className="text-2xl font-extrabold text-white tracking-wide">
                {initials}
            </span>
        </div>
    );
}