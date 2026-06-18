export default function Header() {
  return (
    <header className="text-center">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
          ⚡
        </div>
      </div>

      <h1 className="text-3xl font-bold">
        Welcome to Flux
      </h1>

      <p className="mt-2 text-gray-400">
        The future of realtime communication.
      </p>
    </header>
  );
}