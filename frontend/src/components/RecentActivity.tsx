export default function RecentActivity() {
  const activities = [
    "Sarah Miller just came online",
    "Mike Ross is typing...",
    "Jordan Smith read your message",
  ];

  return (
    <div>
      <h2 className="text-5xl font-bold mb-8">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((activity) => (
          <div
            key={activity}
            className="border border-zinc-800 rounded-xl p-4"
          >
            {activity}
          </div>
        ))}

      </div>
    </div>
  );
}