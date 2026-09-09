"use client";

import { useEffect, useState } from "react";

type Expense = {
  id: number;
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
  id: number;
  title: string;
  dueDate: string;
  category: string;
  completed: boolean;
};

const initialExpenses: Expense[] = [
  { id: 1, category: "家賃", amount: 68000 },
  { id: 2, category: "食費", amount: 24800 },
  { id: 3, category: "光熱費", amount: 12300 },
  { id: 4, category: "その他", amount: 8600 },
];

const initialBills = [
  {
    id: 1,
    name: "電気",
    amount: 4820,
    dueDate: "2026年9月20日",
    icon: "⚡",
    paid: false,
  },
  {
    id: 2,
    name: "ガス",
    amount: 3210,
    dueDate: "2026年9月25日",
    icon: "🔥",
    paid: false,
  },
  {
    id: 3,
    name: "水道",
    amount: 4270,
    dueDate: "2026年9月30日",
    icon: "💧",
    paid: true,
  },
];

const visibleTasks: Task[] = [
  {
    id: 1,
    title: "燃えるゴミ",
  dueDate: "今日 8:00まで",
    category: "ゴミ出し",
    completed: false,
  },
  {
    id: 2,
    title: "クレジットカード支払いを確認",
    dueDate: "明日",
    category: "支払い",
    completed: false,
  },
  {
    id: 3,
    title: "部屋を掃除する",
    dueDate: "土曜日",
    category: "掃除",
    completed: false,
  },
];

const monthlyBudget = 130000;

const formatYen = (amount: number) => {
  return `¥${amount.toLocaleString("ja-JP")}`;
};

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {

    if (typeof window === "undefined") {
      return initialExpenses;
    }

    const savedExpenses = localStorage.getItem("liflow-expenses");

      if (savedExpenses) {
        return JSON.parse(savedExpenses);
    }

    return initialExpenses;
  });

  useEffect(() => {
    localStorage.setItem("liflow-expenses", JSON.stringify(expenses));
  }, [expenses]);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const remainingBudget = monthlyBudget - totalExpense;

  const budgetPercentage = Math.min(
    Math.round((totalExpense / monthlyBudget) * 100),
    100
  );

  const handleAddExpense = () => {
    const amount = Number(expenseAmount);

    if (!expenseCategory || !amount || amount <= 0) {
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      category: expenseCategory,
      amount,
    };

    setExpenses([...expenses, newExpense]);

    setExpenseCategory("");
    setExpenseAmount("");
    setIsExpenseModalOpen(false);
  };

  const [bills, setBills] = useState(initialBills);

useEffect(() => {
  const savedBills = localStorage.getItem("liflow-bills");

  if (savedBills) {
    setBills(JSON.parse(savedBills));
  }
}, []);

 const [tasks, setTasks] = useState<Task[]>(visibleTasks);

 useEffect(() => {
  const savedTasks = localStorage.getItem("liflow-tasks");

  if (savedTasks) {
    try {
      setTasks(JSON.parse(savedTasks));
    } catch {
      setTasks(visibleTasks);
    }
  }
}, []);

const utilities = bills.map((bill) => {
  const changes: Record<string, number> = {
    電気: 12,
    ガス: -8,
    水道: 4,
  };

  return {
    name: bill.name,
    amount: bill.amount,
    change: changes[bill.name] ?? 0,
    icon: bill.icon,
  };
});

  return (
    <main className="min-h-screen bg-[#f7f8fa] pb-24 text-[#20242a]">
      <div className="mx-auto max-w-md px-5 pt-8">
        {/* Header */}
        <header className="flex items-start justify-between">
          <div>
            <p className="text-[15px] text-[#657080]">Good morning</p>

            <h1 className="mt-1 text-[28px] font-bold tracking-tight">
              Yuki 👋
            </h1>

            <p className="mt-5 text-[15px] text-[#657080]">
              2026年9月5日（土）
            </p>
          </div>

          <button
            className="mt-1 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-sm"
            aria-label="通知"
          >
            🔔
          </button>
        </header>

        {/* 今月の支出 */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">今月の支出</h2>

            <button className="text-[15px] font-medium text-[#5b63d3]">
              詳細を見る
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[15px] text-[#657080]">9月の支出</p>

                <p className="mt-1 text-[32px] font-bold tracking-tight">
                  {formatYen(totalExpense)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[13px] text-[#8a929e]">予算</p>
                <p className="mt-1 text-[15px] font-semibold">
                  {formatYen(monthlyBudget)}
                </p>
              </div>
            </div>

            {/* Budget progress */}
            <div className="mt-6">
              <div className="h-2 overflow-hidden rounded-full bg-[#e8e9ed]">
                <div
                  className="h-full rounded-full bg-[#5b63d3] transition-all duration-300"
                  style={{
                    width: `${budgetPercentage}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[13px] text-[#657080]">
                <span>予算の{budgetPercentage}%</span>

                <span>
                  残り{" "}
                  {formatYen(Math.max(remainingBudget, 0))}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#f7f8fa] px-4 py-3">
              <p className="text-[15px]">
                📊 前月より{" "}
                <span className="font-semibold text-[#e45c64]">8%</span>
                出支が増えています
              </p>
            </div>
          </div>
        </section>

        {/* 光熱費 */}
        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">光熱費</h2>

        <button
          onClick={() => (window.location.href = "/tasks")}
          className="text-[15px] font-medium text-[#5b63d3]"
        >
          すべて見る
        </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {utilities.map((utility) => (
              <div
                key={utility.name}
                className="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f8] text-lg">
                  {utility.icon}
                </div>

                <p className="mt-4 text-[14px] text-[#657080]">
                  {utility.name}
                </p>

                <p className="mt-1 text-[19px] font-semibold">
                  {formatYen(utility.amount)}
                </p>

                <p
                  className={`mt-2 text-[13px] ${
                    utility.change > 0
                      ? "text-[#e45c64]"
                      : "text-[#27a58a]"
                  }`}
                >
                  {utility.change > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(utility.change)}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 今日の予定 */}
        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">今日の予定</h2>

            <button className="text-[15px] font-medium text-[#5b63d3]">
              すべて見る
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
           {tasks
  .filter((task) => !task.completed)
  .slice(0, 3)
  .map((task, index, visibleTasks) => (
    <div
      key={task.id}
      className={`flex items-center px-5 py-4 ${
        index !== visibleTasks.length - 1
          ? "border-b border-[#eceef1]"
          : ""
      }`}
    >
      {/* タスクアイコン */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3f4f8] text-lg">
        {task.category === "ゴミ出し"
          ? "🗑️"
          : task.category === "支払い"
            ? "💳"
            : task.category === "掃除"
              ? "🧹"
              : "✓"}
      </div>

      {/* タスク内容 */}
      <div className="ml-4 min-w-0">
        <p className="truncate text-[15px] font-semibold">
          {task.title}
        </p>

        <p className="mt-1 text-[13px] text-[#657080]">
          {task.dueDate}
        </p>
      </div>

      <div className="ml-auto shrink-0 text-xl text-[#c4c9d2]">
        ›
      </div>
    </div>
  ))}
          </div>
        </section>

        {/* Liflow Insight */}
        <section className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[18px] font-bold">Liflow Insight</h2>

            <span className="rounded-full bg-[#eceeff] px-3 py-1 text-[13px] font-semibold text-[#5b63d3]">
              AI
            </span>
          </div>

          <div className="rounded-2xl bg-[#5b63d3] p-6 text-white shadow-sm">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl">
                ✨
              </div>

              <div>
                <h3 className="text-[18px] font-bold">
                  今月の生活について
                </h3>

                <p className="mt-3 text-[15px] leading-7 text-white/90">
                  今月は食費と電気代が先月より増えています。
                  特に電気代は12%増加しています。
                </p>

                <button className="mt-4 rounded-full bg-white px-5 py-2 text-[15px] font-semibold text-[#5b63d3]">
                  詳しく見る
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* クイックアクション */}
        <section className="mt-7">
          <h2 className="mb-4 text-[18px] font-bold">
            クイックアクション
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {/* 支出を追加 */}
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]"
            >
              <div className="text-2xl font-light">＋</div>

              <p className="mt-4 text-[16px] font-semibold">
                支出を追加
              </p>

              <p className="mt-1 text-[13px] text-[#657080]">
                食費・日用品など
              </p>
            </button>

            {/* 請求書を追加 */}
            <button className="rounded-2xl bg-white p-5 text-left shadow-sm transition active:scale-[0.98]">
              <div className="text-2xl">🧾</div>

              <p className="mt-4 text-[16px] font-semibold">
                請求書を追加
              </p>

              <p className="mt-1 text-[13px] text-[#657080]">
                電気・ガス・水道など
              </p>
            </button>
          </div>
        </section>
      </div>

      {/* 下部ナビゲーション */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#eceef1] bg-white">
        <div className="mx-auto grid max-w-md grid-cols-5">
          {[
            ["⌂", "Home"],
            ["¥", "Money"],
            ["▣", "Bills"],
            ["✦", "AI"],
            ["•••", "More"],
          ].map(([icon, label], index) => (
            <button
              key={label}
              className={`flex flex-col items-center py-4 text-[11px] ${
                index === 0
                  ? "text-[#5b63d3]"
                  : "text-[#9aa1ad]"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* 支出追加モーダル */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-bold">
                支出を追加
              </h2>

              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-2xl text-[#8a929e]"
              >
                ×
              </button>
            </div>

            {/* カテゴリ */}
            <div className="mt-6">
              <label className="text-[14px] font-medium">
                カテゴリ
              </label>

              <input
                value={expenseCategory}
                onChange={(e) =>
                  setExpenseCategory(e.target.value)
                }
                placeholder="例：食費"
                className="mt-2 w-full rounded-xl border border-[#dfe2e7] px-4 py-3 text-[15px] outline-none focus:border-[#5b63d3]"
              />
            </div>

            {/* 金額 */}
            <div className="mt-5">
              <label className="text-[14px] font-medium">
                金額
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#657080]">
                  ¥
                </span>

                <input
                  type="number"
                  inputMode="numeric"
                  value={expenseAmount}
                  onChange={(e) =>
                    setExpenseAmount(e.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-[#dfe2e7] py-3 pl-9 pr-4 text-[18px] outline-none focus:border-[#5b63d3]"
                />
              </div>
            </div>

            {/* 追加ボタン */}
            <button
              onClick={handleAddExpense}
              className="mt-7 w-full rounded-xl bg-[#5b63d3] py-4 text-[16px] font-semibold text-white transition active:scale-[0.98]"
            >
              支出を追加する
            </button>
          </div>
        </div>
      )}
    </main>
  );
}