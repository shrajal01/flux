import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <div className="absolute w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-3xl"></div>
      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl">

    <Header />

    <LoginForm />

  </div>
    </main>
    
  );
}