"use client";
import { useEffect, useState } from "react";

type userInfo = {
  name: string;
};

export default function Dashboard() {
  const [user, setUser] = useState(null as userInfo | null);
  useEffect(() => {
    fetch("/api/user", {
      method: "GET",
    })
      .then((res) => res.json())
      .then(setUser);
  }, []);
  if (!user) {
    return (
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Loading...
      </h1>
    );
  }
  return (
    <>
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Welcome {user?.name}
      </h1>
    </>
  );
}

// next level progress circular
// cheque bar chart
// total income
// total sp done
// current rank
