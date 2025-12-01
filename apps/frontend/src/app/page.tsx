import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Praxis
        </h1>
        <p className="text-2xl text-muted-foreground">
          Social Trading Network for Polymarket
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Track Traders</h3>
            <p className="text-muted-foreground">
              Follow top performers and view real-time stats
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Copy Trading</h3>
            <p className="text-muted-foreground">
              Mirror positions from successful traders
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Compete</h3>
            <p className="text-muted-foreground">
              Join contests and climb the leaderboards
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
