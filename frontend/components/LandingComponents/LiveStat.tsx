'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { FaCheckCircle, FaEye, FaYoutube, FaUserGraduate, FaUsers } from "react-icons/fa";

let socket: Socket | null = null;

type Stats = {
  totalStudents: number;
  youtubeViews: number;
  subscribers: number;
  activeUsers: number;
  issuesSolved: number; // static
 
};

export default function LiveStats() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    youtubeViews: 0,
    subscribers: 0,
    activeUsers: 0,
    issuesSolved: 3825, // static
    
  });

 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/website-stats`);//all the yt stats
        const data = await res.json();

        setStats((prev) => ({
          ...prev,
          totalStudents: data.totalStudents || 0,
          youtubeViews: Number(data.youtubeStats?.viewCount || 0),
          subscribers: Number(data.youtubeStats?.subscriberCount || 0),
        }));
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  // for live active users
  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
        path: "/api/active-users",
        transports: ["websocket"],
      });
    }

    socket.on("activeUsers", (count: number) => {
      setStats((prev) => ({ ...prev, activeUsers: count }));
    });

    return () => {
      socket?.off("activeUsers");
      socket?.disconnect();
      socket = null;
    };
  }, []);

 
  return (
<div
  className="w-full overflow-hidden relative  pb-28 "
  style={{
    backgroundColor: '#4A1B09',
    backgroundImage:
      'linear-gradient(to right, #1E0C05 0%, #4A1B09 30%, #AB4918 50%, #4A1B09 80%, #1E0C05 100%)',
  }}
>

   <div className="flex flex-wrap justify-center gap-12 p-6 text-center">
 <StatCard label="Issues Solved" value={stats.issuesSolved} icon={<FaCheckCircle className="text-yellow-500 w-6 h-6 " />} />
<StatCard
  label="YouTube Views"
  
  value={stats.youtubeViews}
  icon={<FaEye className="text-red-500 w-6 h-6" />}
  showBlink={true}
/>

<StatCard label="Subscribers" value={stats.subscribers} icon={<FaYoutube className="text-red-600 w-6 h-6" />}
 />
<StatCard label="Total Learners" value={stats.totalStudents} icon={<FaUserGraduate className="text-blue-500 w-6 h-6" />} />
<StatCard label="Active Users" value={stats.activeUsers} icon={<FaUsers className="text-green-500 w-6 h-6"  />} showBlink={true} />

</div>
</div>
  );
}


function StatCard({
  label,
  value,
  icon,
  showBlink,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
  showBlink?: boolean;
}) {
  return (
    <div className="bg-yellow-200 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition">
      <span className="text-yellow-600 text-sm flex items-center gap-2">
        {icon}
        {label}
      </span>

      <span className="text-3xl font-bold text-yellow-800 mt-2 flex items-center gap-3">
        {showBlink && <span className="blinking-dot"></span>}
        {value.toLocaleString()}
      </span>

      {/*  Blinking dot CSS */}
      <style jsx>{`
        @keyframes blink {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 12px 4px rgba(0, 255, 0, 0.8);
  }
  50% {
    opacity: 0.6;
    box-shadow: 0 0 18px 8px rgba(0, 255, 0, 0.4);
  }
}

.blinking-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #00ff00;
  animation: blink 1.5s infinite ease-in-out;
  display: inline-block;
  box-shadow: 0 0 10px 3px rgba(0, 255, 0, 0.6); /* glowing aura */
}

      `}</style>
    </div>
  );
}


