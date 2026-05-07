"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useCreateLaporan } from "@/hooks";
import {
    type LaporanStep1Values, type LaporanStep2Values, type LaporanStep3Values,
} from "@/schemas/reportSchema";
import { uploadFotoLaporan } from "@/api";
import type { CreateReportRequest } from "@/types";
import {Step1Form} from "@/components/report/Step1Form";
import {Step2Form} from "@/components/report/Step2Form";
import {Step3Form} from "@/components/report/Step3Form";


// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = [
    { label: "Jenis & Identitas" },
    { label: "Lokasi" },
    { label: "Foto & Review" },
] as const;

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center gap-0 mb-8">
            {STEPS.map((step, i) => {
                const done = i < current;
                const active = i === current;
                return (
                    <div key={i} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <div className={[
                                "w-3 h-3 rounded-full transition-all",
                                done ? "bg-orange-500" : active ? "bg-orange-500" : "bg-stone-200",
                            ].join(" ")} />
                            <span className={[
                                "text-xs font-medium whitespace-nowrap",
                                active ? "text-orange-500 font-semibold" : done ? "text-stone-400" : "text-stone-300",
                            ].join(" ")}>
                                {step.label}
                            </span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={[
                                "w-20 sm:w-32 h-px mb-5 mx-1 transition-all",
                                done ? "bg-orange-400" : "bg-stone-200",
                            ].join(" ")} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function NewReportPage() {
    const [step, setStep] = useState(0);
    const [step1Data, setStep1Data] = useState<Partial<LaporanStep1Values>>({});
    const [step2Data, setStep2Data] = useState<Partial<LaporanStep2Values>>({});
    const [step3Data, setStep3Data] = useState<Partial<LaporanStep3Values>>({});
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [fotoFile, setFotoFile] = useState<File | null>(null);

    const createMutation = useCreateLaporan();

    function handleStep1(s1: LaporanStep1Values, s2: LaporanStep2Values) {
        setStep1Data(s1);
        setStep2Data(s2);
        setStep(1);
    }

    function handleStep2(data: LaporanStep3Values) {
        setStep3Data(data);
        setStep(2);
    }

    async function handleFinalSubmit() {
        const payload: CreateReportRequest = {
            type: step1Data.type!,
            name: step2Data.name || null,
            gender: step2Data.gender!,
            estimated_age: step2Data.estimated_age!,
            description: step2Data.description!,
            last_seen_location: step3Data.last_seen_location!,
            city: step3Data.city!,
            province: step3Data.province!,
            latitude: coords?.lat ?? null,
            longitude: coords?.lng ?? null,
        };

        createMutation.mutate(payload, {
            onSuccess: async (res) => {
                if (fotoFile) {
                    try {
                        await uploadFotoLaporan(res.data.id, fotoFile);
                    } catch {
                        toast.warning("Laporan dibuat, tapi foto gagal diupload.");
                    }
                }
            },
            //eslint-disable-next-line
            onError: (err: any) => {
                toast.error(err?.response?.data?.message ?? err.message ?? "Gagal membuat laporan");
            },
        });
    }

    return (
        <PageWrapper>
            <div className="mx-auto max-w-xl w-full">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-stone-900">Buat Laporan</h1>
                    <p className="text-sm text-stone-400 mt-0.5">Langkah {step + 1} dari {STEPS.length}</p>
                </div>

                {/* Step indicator */}
                <StepIndicator current={step} />

                {/* Forms */}
                {step === 0 && (
                    <Step1Form
                        defaultValues={{ ...step1Data, ...step2Data }}
                        onNext={handleStep1}
                    />
                )}
                {step === 1 && (
                    <Step2Form
                        defaultValues={step3Data}
                        coords={coords}
                        onCoordsChange={setCoords}
                        onNext={handleStep2}
                        onBack={() => setStep(0)}
                    />
                )}
                {step === 2 && (
                    <Step3Form
                        step1={step1Data}
                        step2={step2Data}
                        step3={step3Data}
                        coords={coords}
                        fotoFile={fotoFile}
                        onFotoChange={setFotoFile}
                        onSubmit={handleFinalSubmit}
                        onBack={() => setStep(1)}
                        isLoading={createMutation.isPending}
                    />
                )}
            </div>
        </PageWrapper>
    );
}