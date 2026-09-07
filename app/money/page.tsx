"use client";

import { useEffect, useState } from "react";

type Expense = {
  id: number;
  category: string;
  amount: number;
};

const initialExpenses: Expense[] = [
  { id: 1, category: "家賃", amount: 68000 },
  { id: 2, category: "食費", amount: 24800 },
  { id: 3, category: "光熱費", amount: 12300 },
  { id: 4, category: "その他", amount: 8600 },
];

const monthlyBudget = 130000;

const formatYen = (amount: number) => {
  return `¥${amount.toLocaleString("ja-JP")}`;
};

export default function MoneyPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem("liflow-expenses");

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      setExpenses(initialExpenses);
    }
  }, []);

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const remainingBudget = monthlyBudget - totalExpense;

  return (
    <main className="min-h-screen bg-[#f7f8fa] pb-24 text-[#20242a]">
      <div className="mx-auto max-w-md px-5 pt-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[14px] text-[#657080]">
              Money
            </p>

            <h1 className="mt-1 text-[28px] font-bold">
              お金
            </h1>
          </div>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-[14px] font-medium text-[#5b63d3]"
          >
            Home
          </button>
        </header>

        {/* 今月のサマリー */}
        <section className="mt-8">
          <h2 className="text-[18px] font-bold">
            9月の支出
          </h2>

          <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-[14px] text-[#657080]">
              今月使った金額
            </p>

            <p className="mt-1 text-[32px] font-bold">
              {formatYen(totalExpense)}
            </p>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#e8e9ed]">
              <div
                className="h-full rounded-full bg-[#5b63d3]"
                style={{
                  width: `${Math.min(
                    (totalExpense / monthlyBudget) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[13px] text-[#657080]">
              <span>
                予算 {formatYen(monthlyBudget)}
              </span>

              <span>
                残り {formatYen(Math.max(remainingBudget, 0))}
              </span>
            </div>
          </div>
        </section>

        {/* 支出一覧 */}
        <section className="mt-8">

          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">
              支出一覧
            </h2>

            <span className="text-[13px] text-[#657080]">
              {expenses.length}件
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-sm">

            {expenses.map((expense, index) => (
              <div
                key={expense.id}
                className={`flex items-center px-5 py-4 ${
                  index !== expenses.length - 1
                    ? "border-b border-[#eceef1]"
                    : ""
                }`}
              >

                {/* アイコン */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f4f8]">
                  {expense.category === "食費"
                    ? "🍴"
                    : expense.category === "家賃"
                    ? "🏠"
                    : expense.category === "光熱費"
                    ? "💡"
                    : "🛍️"}
                </div>

                {/* カテゴリ */}
                <div className="ml-4">
                  <p className="text-[15px] font-semibold">
                    {expense.category}
                  </p>

                  <p className="mt-1 text-[12px] text-[#9aa1ad]">
                    9月の支出
                  </p>
                </div>

                {/* 金額 */}
                <p className="ml-auto text-[16px] font-semibold">
                  {formatYen(expense.amount)}
                </p>
              </div>
            ))}

          </div>
        </section>

        {/* 支出を追加 */}
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="mt-6 w-full rounded-2xl bg-[#5b63d3] py-4 text-[16px] font-semibold text-white shadow-sm"
        >
          ＋ 支出を追加
        </button>

      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceef1] bg-white">
        <div className="mx-auto grid max-w-md grid-cols-5">

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex flex-col items-center py-4 text-[11px] text-[#9aa1ad]"
          >
            <span className="text-lg">⌂</span>
            <span className="mt-1">Home</span>
          </button>

          <button
            className="flex flex-col items-center py-4 text-[11px] text-[#5b63d3]"
          >
            <span className="text-lg">¥</span>
            <span className="mt-1">Money</span>
          </button>

          <button
            className="flex flex-col items-center py-4 text-[11px] text-[#9aa1ad]"
          >
            <span className="text-lg">▣</span>
            <span className="mt-1">Bills</span>
          </button>

          <button
            className="flex flex-col items-center py-4 text-[11px] text-[#9aa1ad]"
          >
            <span className="text-lg">✦</span>
            <span className="mt-1">AI</span>
          </button>

          <button
            className="flex flex-col items-center py-4 text-[11px] text-[#9aa1ad]"
          >
            <span className="text-lg">•••</span>
            <span className="mt-1">More</span>
          </button>

        </div>
      </nav>
    </main>
  );
}