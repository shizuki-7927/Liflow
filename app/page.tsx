"use client";

import { useState } from "react";

type Expense = {
  category: string;
  amount: number;
};

type Utility = {
  name: string;
  amount: number;
  change: number;
  icon: string;
};

type Task = {
  title: string;
  date: string;
  type: "garbage" | "payment" | "cleaning";
};

const expenses: Expense[] = [
  {
    category: "家賃",
    amount: 68000,
  },
  {
    category: "食費",
    amount: 24800,
  },
  {
    category: "光熱費",
    amount: 12300,
  },
  {
    category: "その他",
    amount: 8600,
  },
];

const utilities: Utility[] = [
  {
    name: "電気",
    amount: 4820,
    change: 12,
    icon: "⚡",
  },
  {
    name: "ガス",
    amount: 3210,
    change: -8,
    icon: "🔥",
  },
  {
    name: "水道",
    amount: 4270,
    change: 4,
    icon: "💧",
  },
];

const tasks: Task[] = [
  {
    title: "燃えるゴミ",
    date: "今日 8:00まで",
    type: "garbage",
  },
  {
    title: "クレジットカード支払い",
    date: "明日",
    type: "payment",
  },
  {
    title: "部屋の掃除",
    date: "土曜日",
    type: "cleaning",
  },
];

const totalExpense = expenses.reduce(
  (total, expense) => total + expense.amount,
  0
);

const monthlyBudget = 130000;

const formatYen = (amount: number) => {
  return new Intl.NumberFormat("ja-JP").format(amount);
};

export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#20242A]">
      <div className="mx-auto min-h-screen max-w-md bg-[#F7F8FA]">
        {/* Header */}
        <header className="flex items-center justify-between px-5 pb-4 pt-8">
          <div>
            <p className="text-sm text-gray-500">Good morning</p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              Yuki 👋
            </h1>
          </div>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="通知"
          >
            <span className="text-lg">🔔</span>
          </button>
        </header>

        {/* Date */}
        <div className="px-5">
          <p className="text-sm text-gray-500">
            2026年9月5日（土）
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6 px-5 pb-28 pt-6">
          {/* Monthly Expense */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold">
                今月の支出
              </h2>

              <button className="text-sm font-medium text-[#5B63D3]">
                詳細を見る
              </button>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    9月の支出
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight">
                    ¥{formatYen(totalExpense)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    予算
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    ¥{formatYen(monthlyBudget)}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-5">
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#5B63D3]"
                    style={{
                      width: `${Math.min(
                        (totalExpense / monthlyBudget) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>
                    予算の
                    {Math.round(
                      (totalExpense / monthlyBudget) * 100
                    )}
                    %
                  </span>

                  <span>
                    残り ¥
                    {formatYen(
                      Math.max(monthlyBudget - totalExpense, 0)
                    )}
                  </span>
                </div>
              </div>

              {/* Comparison */}
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F7F8FA] p-3">
                <span className="text-sm">📊</span>

                <p className="text-sm text-gray-600">
                  先月より
                  <span className="font-semibold text-[#D66A6A]">
                    {" "}
                    8%
                  </span>
                  支出が増えています
                </p>
              </div>
            </div>
          </section>

          {/* Utilities */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold">
                光熱費
              </h2>

              <button className="text-sm font-medium text-[#5B63D3]">
                すべて見る
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {utilities.map((utility) => (
                <div
                  key={utility.name}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4F8]">
                    <span>{utility.icon}</span>
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    {utility.name}
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    ¥{formatYen(utility.amount)}
                  </p>

                  <p
                    className={`mt-1 text-xs font-medium ${
                      utility.change > 0
                        ? "text-[#D66A6A]"
                        : "text-[#4E9A72]"
                    }`}
                  >
                    {utility.change > 0 ? "↑" : "↓"}{" "}
                    {Math.abs(utility.change)}%
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Tasks */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold">
                今日の予定
              </h2>

              <button className="text-sm font-medium text-[#5B63D3]">
                すべて見る
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {tasks.map((task, index) => (
                <div
                  key={task.title}
                  className={`flex items-center gap-3 px-4 py-4 ${
                    index !== tasks.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F4F8]">
                    {task.type === "garbage" && "🗑️"}
                    {task.type === "payment" && "💳"}
                    {task.type === "cleaning" && "🧹"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {task.date}
                    </p>
                  </div>

                  <span className="text-gray-300">
                    ›
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Liflet Insight */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold">
                Liflet Insight
              </h2>

              <span className="rounded-full bg-[#ECEEFE] px-3 py-1 text-xs font-semibold text-[#5B63D3]">
                AI
              </span>
            </div>

            <div className="rounded-2xl bg-[#5B63D3] p-5 text-white shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                  ✨
                </div>

                <div>
                  <p className="font-semibold">
                    今月の生活について
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/85">
                    今月は食費と電気代が先月より増えています。
                    特に電気代は12%増加しています。
                  </p>

                  <button className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#5B63D3]">
                    詳しく見る
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="mb-3 text-[17px] font-semibold">
              クイックアクション
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-white p-4 text-left shadow-sm transition hover:bg-gray-50">
                <span className="text-xl">＋</span>

                <p className="mt-3 text-sm font-semibold">
                  支出を追加
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  食費・日用品など
                </p>
              </button>

              <button className="rounded-2xl bg-white p-4 text-left shadow-sm transition hover:bg-gray-50">
                <span className="text-xl">🧾</span>

                <p className="mt-3 text-sm font-semibold">
                  請求書を追加
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  電気・ガス・水道など
                </p>
              </button>
            </div>
          </section>
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-gray-100 bg-white/95 px-3 pb-5 pt-3 backdrop-blur">
          <div className="grid grid-cols-5">
            {[
              {
                name: "Home",
                icon: "⌂",
              },
              {
                name: "Money",
                icon: "¥",
              },
              {
                name: "Bills",
                icon: "▣",
              },
              {
                name: "AI",
                icon: "✦",
              },
              {
                name: "More",
                icon: "•••",
              },
            ].map((item) => {
              const isActive = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={`text-lg ${
                      isActive
                        ? "font-bold text-[#5B63D3]"
                        : "text-gray-400"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span
                    className={`text-[10px] font-medium ${
                      isActive
                        ? "text-[#5B63D3]"
                        : "text-gray-400"
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </main>
  );
}