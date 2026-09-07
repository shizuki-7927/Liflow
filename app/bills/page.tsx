"use client";

import { useEffect, useState } from "react";

type Bill = {
  id: number;
  name: string;
  amount: number;
  dueDate: string;
  icon: string;
  paid: boolean;
};

const initialBills: Bill[] = [
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

const formatYen = (amount: number) => {
  return `¥${amount.toLocaleString("ja-JP")}`;
};

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const savedBills = localStorage.getItem("liflow-bills");

    if (savedBills) {
      setBills(JSON.parse(savedBills));
    } else {
      setBills(initialBills);
    }
  }, []);

  useEffect(() => {
    if (bills.length > 0) {
      localStorage.setItem(
        "liflow-bills",
        JSON.stringify(bills)
      );
    }
  }, [bills]);

  const totalBills = bills.reduce(
    (total, bill) => total + bill.amount,
    0
  );

  const unpaidBills = bills.filter(
    (bill) => !bill.paid
  );

  const unpaidAmount = unpaidBills.reduce(
    (total, bill) => total + bill.amount,
    0
  );

  const [editingBill, setEditingBill] = useState<Bill | null>(
  null
);

const [editBillAmount, setEditBillAmount] = useState("");

const handleOpenBillEdit = (bill: Bill) => {
  setEditingBill(bill);
  setEditBillAmount(String(bill.amount));
};

const handleSaveBillEdit = () => {
  if (!editingBill) {
    return;
  }

  const amount = Number(editBillAmount);

  if (!amount || amount <= 0) {
    return;
  }

  const updatedBills = bills.map((bill) =>
    bill.id === editingBill.id
      ? {
          ...bill,
          amount,
        }
      : bill
  );

  setBills(updatedBills);
  setEditingBill(null);
  setEditBillAmount("");
};

const handleTogglePaid = (id: number) => {
  setBills((currentBills) =>
    currentBills.map((bill) =>
      bill.id === id
        ? { ...bill, paid: !bill.paid }
        : bill
    )
  );
};

  const togglePaid = (id: number) => {
    setBills(
      bills.map((bill) =>
        bill.id === id
          ? {
              ...bill,
              paid: !bill.paid,
            }
          : bill
      )
    );
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] pb-24 text-[#20242a]">
      <div className="mx-auto max-w-md px-5 pt-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[14px] text-[#657080]">
              Bills
            </p>

            <h1 className="mt-1 text-[28px] font-bold">
              請求・光熱費
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

        {/* サマリー */}
        <section className="mt-8">
          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-[13px] text-[#657080]">
                今月の光熱費
              </p>

              <p className="mt-2 text-[23px] font-bold">
                {formatYen(totalBills)}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-[13px] text-[#657080]">
                未払い
              </p>

              <p className="mt-2 text-[23px] font-bold text-[#e45c64]">
                {formatYen(unpaidAmount)}
              </p>
            </div>

          </div>
        </section>

        {/* 請求一覧 */}
        <section className="mt-8">

          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">
              請求一覧
            </h2>

            <span className="text-[13px] text-[#657080]">
              {bills.length}件
            </span>
          </div>

          <div className="mt-4 space-y-3">

            {bills.map((bill) => (
                <div
                    key={bill.id}
                    className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
                >
                    {/* 上段：アイコン・名前・金額 */}
                    <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* アイコン */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f3f4f8] text-2xl">
                        {bill.icon}
                        </div>

                        {/* 名前・支払期限 */}
                        <div>
                        <h2 className="text-lg font-bold text-[#20242a]">
                            {bill.name}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            支払期限：{bill.dueDate}
                        </p>
                        </div>
                    </div>

                    {/* 金額 */}
                    <p className="shrink-0 text-xl font-bold text-[#20242a]">
                        ¥{bill.amount.toLocaleString()}
                    </p>
                    </div>

                    {/* 下段：ステータス・操作 */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {/* 支払い状態 */}
                    {bill.paid ? (
                        <span className="inline-flex min-w-[96px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#e8f7f2] px-3 py-2 text-sm font-semibold text-[#159570]">
                            ✓ 支払い済み
                        </span>
                    ) : (
                        <span className="inline-flex min-w-[80px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#fff0f1] px-3 py-2 text-sm font-semibold text-[#e45b68]">
                            未払い
                        </span>
                    )}

                    {/* 操作ボタン */}
                    <div className="grid flex-1 grid-cols-2 gap-2">
                        {/* 金額を編集 */}
                        <button
                        onClick={() => handleOpenBillEdit(bill)}
                        className="rounded-xl bg-[#f0f1fb] px-4 py-3 text-sm font-semibold text-[#5b63d3] transition hover:bg-[#e5e7f8] active:scale-[0.98]"
                        >
                        金額を編集
                        </button>

                        {/* 支払い状態変更 */}
                        {bill.paid ? (
                        <button
                            onClick={() => handleTogglePaid(bill.id)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-gray-50 active:scale-[0.98]"
                        >
                            未払いに戻す
                        </button>
                        ) : (
                        <button
                            onClick={() => handleTogglePaid(bill.id)}
                            className="rounded-xl bg-[#5b63d3] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4f56c2] active:scale-[0.98]"
                        >
                            支払い済みにする
                        </button>
                        )}
                    </div>
                </div>
            </div>
        ))}

          </div>
        </section>

        {/* 請求書を追加 */}
        <button
          className="mt-6 w-full rounded-2xl bg-[#5b63d3] py-4 text-[16px] font-semibold text-white shadow-sm"
        >
          ＋ 請求書を追加
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
            onClick={() => {
              window.location.href = "/money";
            }}
            className="flex flex-col items-center py-4 text-[11px] text-[#9aa1ad]"
          >
            <span className="text-lg">¥</span>
            <span className="mt-1">Money</span>
          </button>

          <button
            className="flex flex-col items-center py-4 text-[11px] text-[#5b63d3]"
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

      {editingBill && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 sm:items-center">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">

                <div className="flex items-center justify-between">
                    <h2 className="text-[20px] font-bold">
                        {editingBill.name}を編集
                    </h2>

                    <button
                        onClick={() => setEditingBill(null)}
                        className="text-2xl text-[#8a929e]"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-6">
                    <label className="text-[14px] font-medium">
                        請求金額
                    </label>

                <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#657080]">
                        ¥
                    </span>

                    <input
                        type="number"
                        value={editBillAmount}
                        onChange={(e) =>
                            setEditBillAmount(e.target.value)
                        }
                        className="w-full rounded-xl border border-[#dfe2e7] py-3 pl-9 pr-4 text-[18px] outline-none focus:border-[#5b63d3]"
                    />
                </div>
            </div>

            <button
                onClick={handleSaveBillEdit}
                className="mt-7 w-full rounded-xl bg-[#5b63d3] py-4 text-[16px] font-semibold text-white"
        >
            変更を保存
        </button>

        </div>
    </div>
    )}

    </main>
  );
}