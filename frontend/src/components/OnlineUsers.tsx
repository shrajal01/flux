export default function OnlineUsers() {
  const users = [
    {
      name: "Sarah",
      color: "bg-purple-500",
      bordered: true,
    },
    {
      name: "David",
      color: "bg-blue-500",
      bordered: false,
    },
    {
      name: "Chloe",
      color: "bg-cyan-500",
      bordered: false,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-4xl font-semibold">
          Currently Online
        </h3>

        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
          LIVE
        </span>
      </div>

      <div className="flex gap-8">
        {users.map((user) => (
          <div
            key={user.name}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <div
              className={`relative ${
                user.bordered
                  ? "p-1 rounded-full border-2 border-purple-500"
                  : ""
              }`}
            >
              <div
                className={`w-16 h-16 rounded-full ${user.color}`}
              />

              <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
            </div>

            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}