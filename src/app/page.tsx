"use client";

import { useState } from "react";

interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

export default function Home() {
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [currency, setCurrency] = useState<string>("$");
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: 1, start: "", end: "" },
  ]);

  const addSlot = () => {
    setSlots([...slots, { id: Date.now(), start: "", end: "" }]);
  };

  const removeSlot = (id: number) => {
    if (slots.length > 1) {
      setSlots(slots.filter((slot) => slot.id !== id));
    }
  };

  const updateSlot = (id: number, field: "start" | "end", value: string) => {
    setSlots(
      slots.map((slot) => (slot.id === id ? { ...slot, [field]: value } : slot))
    );
  };

  const calculateSlotMinutes = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    return Math.max(0, endTotal - startTotal);
  };

  const totalMinutes = slots.reduce(
    (sum, slot) => sum + calculateSlotMinutes(slot.start, slot.end),
    0
  );

  const totalHours = totalMinutes / 60;
  const totalCost = totalHours * hourlyRate;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0 && mins === 0) return "—";
    if (hours === 0) return `${mins} мин`;
    if (mins === 0) return `${hours} ч`;
    return `${hours} ч ${mins} мин`;
  };

  const filledSlotsCount = slots.filter(
    (slot) => slot.start && slot.end
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-6 dark:from-zinc-950 dark:to-zinc-900 sm:py-12">
      <main className="mx-auto max-w-lg px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white sm:text-3xl">
            Расчёт рабочего времени
          </h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">
            Добавьте рабочие слоты и получите итоговую стоимость
          </p>
        </div>

        {/* Hourly Rate Card */}
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 transition-shadow hover:shadow-md dark:bg-zinc-800/50 dark:ring-zinc-700/50">
          <label className="mb-3 block text-sm font-medium text-slate-600 dark:text-zinc-300">
            Часовая ставка
          </label>
          <div className="flex gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
            >
              <option value="$">$</option>
              <option value="€">€</option>
              <option value="₽">₽</option>
              <option value="£">£</option>
            </select>
            <div className="relative flex-1">
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                min="0"
                step="0.5"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-16 text-lg font-medium text-slate-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-zinc-500">
                / час
              </span>
            </div>
          </div>
        </div>

        {/* Time Slots Section */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-700 dark:text-white">
                Рабочие слоты
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                {filledSlotsCount} из {slots.length} заполнено
              </p>
            </div>
            <button
              onClick={addSlot}
              className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow active:scale-95"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Добавить
            </button>
          </div>

          <div className="space-y-3">
            {slots.map((slot, index) => {
              const slotMinutes = calculateSlotMinutes(slot.start, slot.end);
              const hasTime = slot.start && slot.end;

              return (
                <div
                  key={slot.id}
                  className={`group rounded-xl bg-white p-4 shadow-sm ring-1 transition-all hover:shadow-md dark:bg-zinc-800/50 ${
                    hasTime
                      ? "ring-green-200 dark:ring-green-900/50"
                      : "ring-slate-200/50 dark:ring-zinc-700/50"
                  }`}
                >
                  {/* Slot Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600 dark:bg-zinc-700 dark:text-zinc-300">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      {hasTime && (
                        <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                          {formatTime(slotMinutes)}
                        </span>
                      )}
                      {slots.length > 1 && (
                        <button
                          onClick={() => removeSlot(slot.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                          title="Удалить слот"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Time Inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">
                        Начало
                      </label>
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          updateSlot(slot.id, "start", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-base font-medium text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-zinc-400">
                        Конец
                      </label>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          updateSlot(slot.id, "end", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-base font-medium text-slate-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white shadow-lg dark:from-zinc-800 dark:to-zinc-900">
          <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
            Итого
          </h3>

          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Рабочих слотов:</span>
              <span className="font-medium">{filledSlotsCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Общее время:</span>
              <span className="font-medium">{formatTime(totalMinutes)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Ставка:</span>
              <span className="font-medium">
                {currency}
                {hourlyRate} / час
              </span>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-end justify-between">
              <span className="text-lg text-slate-300">К оплате:</span>
              <div className="text-right">
                <span className="text-3xl font-bold">
                  {currency}
                  {totalCost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-zinc-500">
          Расчёт обновляется автоматически при изменении данных
        </p>
      </main>
    </div>
  );
}
