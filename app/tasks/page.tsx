"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  dueDate: string;
  category: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "燃えるゴミを出す",
    dueDate: "今日 8:00まで",
    category: "ゴミ出し",
    completed: false,
  },
  {
    id: 2,
    title: "クレジットカードの支払いを確認",
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
  {
    id: 4,
    title: "洗濯する",
    dueDate: "今週中",
    category: "洗濯",
    completed: true,
  },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newCategory, setNewCategory] = useState("その他");

  // localStorageから読み込む
  useEffect(() => {
    const savedTasks = localStorage.getItem("liflow-tasks");

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks(initialTasks);
      }
    }

    setIsLoaded(true);
  }, []);

  // localStorageに保存
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("liflow-tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  // 完了・未完了を切り替える
  const handleToggleTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  // タスクを削除
  const handleDeleteTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  // タスクを追加
  const handleAddTask = () => {
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTitle.trim(),
      dueDate: newDueDate.trim() || "期限なし",
      category: newCategory,
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);

    setNewTitle("");
    setNewDueDate("");
    setNewCategory("その他");
    setIsModalOpen(false);
  };

  const incompleteTasks = tasks.filter(
    (task) => !task.completed
  );

  const completedTasks = tasks.filter(
    (task) => task.completed
  );

  return (
    <main className="min-h-screen bg-[#f7f8fa] pb-28">
      {/* ヘッダー */}
      <div className="px-5 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#5b63d3]">
              Life Tasks
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#20242a]">
              やること
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              今日やることを、ここで整理しよう。
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5b63d3] text-2xl text-white shadow-sm transition hover:bg-[#4f56c2] active:scale-95"
            aria-label="タスクを追加"
          >
            +
          </button>
        </div>
      </div>

      {/* タスクサマリー */}
      <section className="px-5 pt-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <p className="text-sm text-gray-500">
            未完了のタスク
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-[#20242a]">
              {incompleteTasks.length}
            </span>

            <span className="pb-1 text-sm text-gray-500">
              件
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#5b63d3] transition-all"
              style={{
                width:
                  tasks.length === 0
                    ? "0%"
                    : `${(completedTasks.length / tasks.length) * 100}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-gray-400">
            {completedTasks.length}件完了 / {tasks.length}件
          </p>
        </div>
      </section>

      {/* 未完了タスク */}
      <section className="px-5 pt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#20242a]">
            やること
          </h2>

          <span className="text-sm text-gray-400">
            {incompleteTasks.length}件
          </span>
        </div>

        <div className="space-y-3">
          {incompleteTasks.length === 0 ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
              <div className="text-3xl">🎉</div>

              <p className="mt-3 font-semibold text-[#20242a]">
                すべて完了！
              </p>

              <p className="mt-1 text-sm text-gray-500">
                今日やることはありません。
              </p>
            </div>
          ) : (
            incompleteTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start gap-3">
                  {/* 完了ボタン */}
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white transition hover:border-[#5b63d3] hover:bg-[#f0f1fb]"
                    aria-label="タスクを完了"
                  />

                  {/* タスク内容 */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#20242a]">
                      {task.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#f0f1fb] px-3 py-1 text-xs font-medium text-[#5b63d3]">
                        {task.category}
                      </span>

                      <span className="text-xs text-gray-500">
                        {task.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* 削除 */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="shrink-0 px-2 py-1 text-xs text-gray-400 transition hover:text-red-500"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 完了済み */}
      {completedTasks.length > 0 && (
        <section className="px-5 pt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#20242a]">
              完了済み
            </h2>

            <span className="text-sm text-gray-400">
              {completedTasks.length}件
            </span>
          </div>

          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-2xl bg-white p-4 opacity-70 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start gap-3">
                  {/* 完了ボタン */}
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5b63d3] text-sm font-bold text-white transition hover:bg-[#4f56c2]"
                    aria-label="未完了に戻す"
                  >
                    ✓
                  </button>

                  {/* タスク内容 */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-400 line-through">
                      {task.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-400">
                        {task.category}
                      </span>

                      <span className="text-xs text-gray-400">
                        {task.dueDate}
                      </span>
                    </div>
                  </div>

                  {/* 削除 */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="shrink-0 px-2 py-1 text-xs text-gray-400 transition hover:text-red-500"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 追加モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 px-4 pb-4 sm:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#20242a]">
                タスクを追加
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-gray-400"
              >
                ×
              </button>
            </div>

            {/* タスク名 */}
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-700">
                タスク名
              </label>

              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="例：洗濯をする"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#5b63d3] focus:bg-white"
              />
            </div>

            {/* 期限 */}
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">
                期限
              </label>

              <input
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                placeholder="例：今日 18:00まで"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#5b63d3] focus:bg-white"
              />
            </div>

            {/* カテゴリ */}
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">
                カテゴリ
              </label>

              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-[#5b63d3]"
              >
                <option>その他</option>
                <option>ゴミ出し</option>
                <option>掃除</option>
                <option>洗濯</option>
                <option>支払い</option>
                <option>買い物</option>
              </select>
            </div>

            {/* ボタン */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-500"
              >
                キャンセル
              </button>

              <button
                onClick={handleAddTask}
                className="flex-1 rounded-xl bg-[#5b63d3] py-3 text-sm font-semibold text-white transition hover:bg-[#4f56c2] active:scale-[0.98]"
              >
                追加する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 下部ナビ */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">⌂</span>
            ホーム
          </button>

          <button
            onClick={() => (window.location.href = "/money")}
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">¥</span>
            お金
          </button>

          <button
            onClick={() => (window.location.href = "/bills")}
            className="flex flex-col items-center gap-1 text-xs text-gray-400"
          >
            <span className="text-xl">▣</span>
            請求
          </button>

          <button
            className="flex flex-col items-center gap-1 text-xs font-semibold text-[#5b63d3]"
          >
            <span className="text-xl">✓</span>
            やること
          </button>
        </div>
      </nav>
    </main>
  );
}