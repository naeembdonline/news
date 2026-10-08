"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    UserPlus,
    ShieldCheck,
    Shield,
    Key,
    Mail,
    Search,
    Pencil,
    Trash2,
    CheckCircle2,
    X,
    ChevronRight,
    Briefcase,
    Building2,
} from "lucide-react";
import { toBengaliNumber } from "@/lib/bengaliUtils";

export type UserRole =
    | "super-admin"
    | "editor-in-chief"
    | "sub-editor"
    | "reporter"
    | "ad-manager";

export interface NewsUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    department: string;
    designation: string;
    status: "active" | "inactive";
    lastActive: string;
    avatarColor: string;
}

const ROLE_DEFINITIONS: Record<
    UserRole,
    { label: string; badgeClass: string; desc: string; icon: typeof ShieldCheck }
> = {
    "super-admin": {
        label: "সুপার এডমিন",
        badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
        desc: "সিস্টেমের পূর্ণ প্রশাসনিক ও কারিগরি নিয়ন্ত্রণ",
        icon: ShieldCheck,
    },
    "editor-in-chief": {
        label: "প্রধান সম্পাদক",
        badgeClass: "bg-red-100 text-red-800 border-red-200",
        desc: "সংবাদ প্রকাশ, প্রত্যাহার ও এডিটোরিয়াল পলিসি নিয়ন্ত্রণ",
        icon: Shield,
    },
    "sub-editor": {
        label: "সহকারী সম্পাদক",
        badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
        desc: "খসড়া পর্যালোচনা, সংশোধন ও প্রকাশনার জন্য অনুমোদন",
        icon: Key,
    },
    reporter: {
        label: "নিজস্ব প্রতিবেদক",
        badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        desc: "নতুন সংবাদ তৈরি ও সম্পাদনা ডেস্কে জমা দেওয়া",
        icon: Briefcase,
    },
    "ad-manager": {
        label: "বিজ্ঞাপন ব্যবস্থাপক",
        badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
        desc: "বিজ্ঞাপন স্লট ও স্পনসরড কনটেন্ট পরিচালনা",
        icon: Building2,
    },
};

const DEFAULT_USERS: NewsUser[] = [
    {
        id: "usr-1",
        name: "ড. সাইদুর রহমান",
        email: "editor@noyabangla.com.bd",
        role: "editor-in-chief",
        department: "প্রধান সম্পাদকীয়",
        designation: "প্রধান সম্পাদক",
        status: "active",
        lastActive: "১০ মিনিট আগে",
        avatarColor: "bg-red-700",
    },
    {
        id: "usr-2",
        name: "তানজিমুল হাসান",
        email: "admin@noyabangla.com.bd",
        role: "super-admin",
        department: "কারিগরি ও সিস্টেম",
        designation: "হেড অব টেকনোলজি",
        status: "active",
        lastActive: "এইমাত্র",
        avatarColor: "bg-purple-700",
    },
    {
        id: "usr-3",
        name: "ফারহানা করিম",
        email: "farhana@noyabangla.com.bd",
        role: "sub-editor",
        department: "জাতীয় ও রাজনীতি",
        designation: "যুগ্ম বার্তা সম্পাদক",
        status: "active",
        lastActive: "১ ঘণ্টা আগে",
        avatarColor: "bg-blue-700",
    },
    {
        id: "usr-4",
        name: "রাহুল দে",
        email: "rahul@noyabangla.com.bd",
        role: "reporter",
        department: "খেলাধুলা",
        designation: "বিশেষ ক্রীড়া প্রতিনিধি",
        status: "active",
        lastActive: "আজ সকাল ৯:৩০",
        avatarColor: "bg-emerald-700",
    },
    {
        id: "usr-5",
        name: "নাসরিন জাহান",
        email: "nasrin@noyabangla.com.bd",
        role: "reporter",
        department: "বিজ্ঞান ও প্রযুক্তি",
        designation: "প্রযুক্তি রিপোর্টার",
        status: "active",
        lastActive: "গতকাল",
        avatarColor: "bg-teal-700",
    },
    {
        id: "usr-6",
        name: "আহমেদ জুবায়ের",
        email: "ads@noyabangla.com.bd",
        role: "ad-manager",
        department: "বাণিজ্যিক ও বিজ্ঞাপন",
        designation: "বিজ্ঞাপন সেলস হেড",
        status: "inactive",
        lastActive: "৩ দিন আগে",
        avatarColor: "bg-amber-700",
    },
];

const STORAGE_KEY = "craftera_admin_users";

export default function UsersManagementPage() {
    const [users, setUsers] = useState<NewsUser[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<NewsUser | null>(null);

    // Form inputs for modal
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState<UserRole>("reporter");
    const [formDept, setFormDept] = useState("জাতীয়");
    const [formDesignation, setFormDesignation] = useState("");
    const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");

    // Load from localStorage or use defaults
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setUsers(JSON.parse(saved));
            } else {
                setUsers(DEFAULT_USERS);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
            }
        } catch {
            setUsers(DEFAULT_USERS);
        }
    }, []);

    // Save changes to localStorage
    const persistUsers = (newUsers: NewsUser[]) => {
        setUsers(newUsers);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsers));
        } catch (e) {
            console.error("Failed to persist users", e);
        }
    };

    // Auto dismiss toast
    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => setToastMessage(null), 4000);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    const openAddModal = () => {
        setEditingUser(null);
        setFormName("");
        setFormEmail("");
        setFormRole("reporter");
        setFormDept("জাতীয়");
        setFormDesignation("");
        setFormStatus("active");
        setIsAddModalOpen(true);
    };

    const openEditModal = (user: NewsUser) => {
        setEditingUser(user);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormRole(user.role);
        setFormDept(user.department);
        setFormDesignation(user.designation);
        setFormStatus(user.status);
        setIsAddModalOpen(true);
    };

    const handleSaveUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim() || !formEmail.trim()) {
            alert("নাম এবং ইমেইল ঠিকানা পূরণ করা আবশ্যক।");
            return;
        }

        if (editingUser) {
            // Update
            const updated = users.map((u) =>
                u.id === editingUser.id
                    ? {
                          ...u,
                          name: formName.trim(),
                          email: formEmail.trim(),
                          role: formRole,
                          department: formDept.trim(),
                          designation: formDesignation.trim() || ROLE_DEFINITIONS[formRole].label,
                          status: formStatus,
                      }
                    : u
            );
            persistUsers(updated);
            setToastMessage(`ব্যবহারকারী "${formName}" এর তথ্য হালনাগাদ করা হয়েছে।`);
        } else {
            // Add new
            const colors = [
                "bg-red-700",
                "bg-blue-700",
                "bg-emerald-700",
                "bg-purple-700",
                "bg-amber-700",
                "bg-indigo-700",
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const newUser: NewsUser = {
                id: `usr-${Date.now()}`,
                name: formName.trim(),
                email: formEmail.trim(),
                role: formRole,
                department: formDept.trim() || "সাধারণ",
                designation: formDesignation.trim() || ROLE_DEFINITIONS[formRole].label,
                status: formStatus,
                lastActive: "এইমাত্র যুক্ত",
                avatarColor: randomColor,
            };
            persistUsers([newUser, ...users]);
            setToastMessage(`নতুন ব্যবহারকারী "${formName}" সফলভাবে যুক্ত করা হয়েছে।`);
        }

        setIsAddModalOpen(false);
    };

    const handleDeleteUser = (id: string, name: string) => {
        if (confirm(`আপনি কি নিশ্চিতভাবে "${name}" কে অপসারণ করতে চান?`)) {
            const updated = users.filter((u) => u.id !== id);
            persistUsers(updated);
            setToastMessage(`ব্যবহারকারী "${name}" অপসারণ করা হয়েছে।`);
        }
    };

    const toggleStatus = (id: string) => {
        const updated = users.map((u) =>
            u.id === id ? { ...u, status: u.status === "active" ? ("inactive" as const) : ("active" as const) } : u
        );
        persistUsers(updated);
        const toggled = updated.find((u) => u.id === id);
        setToastMessage(
            `ব্যবহারকারী স্ট্যাটাস পরিবর্তিত: ${toggled?.status === "active" ? "সক্রিয়" : "নিষ্ক্রিয়"}`
        );
    };

    // Filter logic
    const filteredUsers = users.filter((u) => {
        if (selectedRoleFilter !== "all" && u.role !== selectedRoleFilter) return false;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchName = u.name.toLowerCase().includes(q);
            const matchEmail = u.email.toLowerCase().includes(q);
            const matchDept = u.department.toLowerCase().includes(q);
            if (!matchName && !matchEmail && !matchDept) return false;
        }
        return true;
    });

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const editorsCount = users.filter(
        (u) => u.role === "editor-in-chief" || u.role === "sub-editor"
    ).length;
    const reportersCount = users.filter((u) => u.role === "reporter").length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* ─── Page Top Bar ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Link href="/admin" className="hover:text-slate-800">ড্যাশবোর্ড</Link>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-800 font-semibold">ব্যবহারকারী ও রোল</span>
                    </nav>
                    <h1
                        className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        ব্যবহারকারী ও রোল ব্যবস্থাপনা (Users & Roles)
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        নিউজকাউন্টার এডিটরদের ভূমিকা, অনুমতি ও অ্যাক্সেস নিয়ন্ত্রণ স্তর পরিচালনা করুন।
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-red-700 hover:bg-red-800 text-white transition-all shadow-sm flex items-center gap-2"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>নতুন সদস্য যোগ করুন</span>
                    </button>
                </div>
            </div>

            {/* ─── Toast Banner ─── */}
            {toastMessage && (
                <div
                    className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-2xs animate-fade-in"
                    role="alert"
                >
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                            {toastMessage}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToastMessage(null)}
                        className="text-emerald-700 hover:text-emerald-900 text-xs font-bold p-1 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* ─── Metric Cards ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: "মোট ব্যবহারকারী", count: totalUsers, color: "text-slate-900" },
                    { label: "বর্তমানে সক্রিয়", count: activeUsers, color: "text-emerald-700" },
                    { label: "সম্পাদকীয় প্যানেল", count: editorsCount, color: "text-blue-700" },
                    { label: "নিবন্ধিত প্রতিবেদক", count: reportersCount, color: "text-purple-700" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                        <div className="text-xs text-slate-500 font-medium" style={{ fontFamily: "var(--font-headline)" }}>
                            {stat.label}
                        </div>
                        <div className={`text-2xl font-black ${stat.color} mt-1`} style={{ fontFamily: "var(--font-headline)" }}>
                            {toBengaliNumber(stat.count)} জন
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Filter & Search Bar ─── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Role Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                        <button
                            type="button"
                            onClick={() => setSelectedRoleFilter("all")}
                            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                                selectedRoleFilter === "all"
                                    ? "bg-slate-900 text-white shadow-2xs"
                                    : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            সকল ({toBengaliNumber(users.length)})
                        </button>
                        {Object.entries(ROLE_DEFINITIONS).map(([roleKey, def]) => {
                            const count = users.filter((u) => u.role === roleKey).length;
                            return (
                                <button
                                    key={roleKey}
                                    type="button"
                                    onClick={() => setSelectedRoleFilter(roleKey)}
                                    className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                        selectedRoleFilter === roleKey
                                            ? "bg-slate-900 text-white shadow-2xs"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    <span>{def.label}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                                        {toBengaliNumber(count)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="নাম, ইমেইল বা বিভাগ..."
                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* ─── Users Table ─── */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                            <tr>
                                <th className="px-5 py-3.5">ব্যবহারকারীর নাম ও পরিচয়</th>
                                <th className="px-4 py-3.5">ভূমিকা (Role)</th>
                                <th className="px-4 py-3.5">বিভাগ ও পদবি</th>
                                <th className="px-4 py-3.5">স্ট্যাটাস</th>
                                <th className="px-4 py-3.5">সর্বশেষ সক্রিয়</th>
                                <th className="px-5 py-3.5 text-right">অ্যাকশন</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                        <div className="text-sm font-bold text-slate-700" style={{ fontFamily: "var(--font-headline)" }}>
                                            কোনো ব্যবহারকারী পাওয়া যায়নি
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => {
                                    const roleDef = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS["reporter"];
                                    const RoleIcon = roleDef.icon;

                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* Name & Avatar */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={`w-9 h-9 rounded-full ${user.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0`}
                                                    >
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div
                                                            className="font-bold text-slate-900 text-sm leading-tight"
                                                            style={{ fontFamily: "var(--font-headline)" }}
                                                        >
                                                            {user.name}
                                                        </div>
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-mono">
                                                            <Mail className="w-3 h-3 text-slate-400" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${roleDef.badgeClass}`}
                                                    title={roleDef.desc}
                                                >
                                                    <RoleIcon className="w-3.5 h-3.5" />
                                                    <span>{roleDef.label}</span>
                                                </span>
                                            </td>

                                            {/* Department & Designation */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="text-slate-800 font-semibold">{user.designation}</div>
                                                <div className="text-[11px] text-slate-400">{user.department}</div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(user.id)}
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                                                        user.status === "active"
                                                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                                    }`}
                                                    title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                                                >
                                                    {user.status === "active" ? (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                                            <span>সক্রিয়</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                                            <span>নিষ্ক্রিয়</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Last Active */}
                                            <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                                                {user.lastActive}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(user)}
                                                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                                                        title="রোল ও তথ্য সম্পাদনা"
                                                        aria-label="ব্যবহারকারী সম্পাদনা করুন"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                                        title="মুছে ফেলুন"
                                                        aria-label="ব্যবহারকারী মুছে ফেলুন"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── Role Description Overview Card ─── */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700" style={{ fontFamily: "var(--font-headline)" }}>
                    নিউজকাউন্টার রোল পারমিশন নির্দেশিকা
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {Object.entries(ROLE_DEFINITIONS).map(([key, def]) => {
                        const IconComp = def.icon;
                        return (
                            <div key={key} className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5">
                                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900" style={{ fontFamily: "var(--font-headline)" }}>
                                    <IconComp className="w-3.5 h-3.5 text-slate-600" />
                                    <span>{def.label}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-tight">
                                    {def.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ─── Add/Edit User Modal ─── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-scale-in">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-headline)" }}>
                                {editingUser ? "ব্যবহারকারীর তথ্য সম্পাদনা" : "নতুন টিম সদস্য যোগ করুন"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1 rounded text-slate-400 hover:text-slate-700"
                                aria-label="বন্ধ করুন"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                    পূর্ণ নাম <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="উদা: ড. সাইদুর রহমান"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                    ইমেইল ঠিকানা <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    placeholder="name@noyabangla.com.bd"
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                    ভূমিকা / রোল (Role) <span className="text-red-600">*</span>
                                </label>
                                <select
                                    value={formRole}
                                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold"
                                >
                                    {Object.entries(ROLE_DEFINITIONS).map(([key, def]) => (
                                        <option key={key} value={key}>
                                            {def.label} — {def.desc}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                        বিভাগ (Department)
                                    </label>
                                    <input
                                        type="text"
                                        value={formDept}
                                        onChange={(e) => setFormDept(e.target.value)}
                                        placeholder="জাতীয়, খেলাধুলা, ইত্যাদি"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                        পদবি (Designation)
                                    </label>
                                    <input
                                        type="text"
                                        value={formDesignation}
                                        onChange={(e) => setFormDesignation(e.target.value)}
                                        placeholder="উদা: বার্তা সম্পাদক"
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                    অ্যাকাউন্ট স্ট্যাটাস
                                </label>
                                <div className="flex items-center gap-4 pt-1">
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="active"
                                            checked={formStatus === "active"}
                                            onChange={() => setFormStatus("active")}
                                            className="text-emerald-600 focus:ring-emerald-500"
                                        />
                                        <span className="font-semibold text-slate-800">সক্রিয় (Active)</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="inactive"
                                            checked={formStatus === "inactive"}
                                            onChange={() => setFormStatus("inactive")}
                                            className="text-slate-600 focus:ring-slate-500"
                                        />
                                        <span className="font-semibold text-slate-600">নিষ্ক্রিয় (Inactive)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors"
                                >
                                    {editingUser ? "সংরক্ষণ করুন" : "সদস্য যুক্ত করুন"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
