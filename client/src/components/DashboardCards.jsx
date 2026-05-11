const DashboardCards = ({ stats }) => {
  const cards = [
    { label: "Total Tasks", value: stats.totalTasks, color: "from-indigo-500 to-indigo-700" },
    { label: "Completed", value: stats.completedTasks, color: "from-emerald-500 to-emerald-700" },
    { label: "Pending", value: stats.pendingTasks, color: "from-amber-500 to-amber-700" },
    { label: "Overdue", value: stats.overdueTasks, color: "from-rose-500 to-rose-700" }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={`rounded-2xl bg-gradient-to-r p-[1px] ${card.color}`}>
          <div className="rounded-2xl bg-slate-900 p-4">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-white">{card.value ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
