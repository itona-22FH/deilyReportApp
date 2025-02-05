import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const RealtimeSync = () => {
  const [isSyncing, setIsSyncing] = useState(false);

  // useEffect(() => {
  //   const syncInterval = setInterval(() => {
  //     setIsSyncing(true)
  //     // Simulate syncing process
  //     setTimeout(() => setIsSyncing(false), 1000)
  //   }, 5000)

  //   return () => clearInterval(syncInterval)
  // }, [])

  useEffect(() => {
    setIsSyncing(false);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-2 rounded-full shadow">
      {isSyncing ? (
        <Loader2 className="h-6 w-6 animate-spin text-vivid-blue" />
      ) : (
        <div className="h-6 w-6 rounded-full bg-vivid-green"></div>
      )}
    </div>
  );
}
