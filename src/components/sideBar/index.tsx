
import Link from 'next/link';
import React, { ReactNode } from 'react';
type SideBarProps = {
  children: ReactNode;
};

const SideBar: React.FC<SideBarProps> = ({ children }) => {
  return (
        <div className="flex flex-col h-screen">
        {/* HEADER */}
        <div className="bg-zinc-900 flex">
          <div className="w-3/4 mx-auto text-emerald-500 py-4">
            Crud - Products
          </div>
        </div>
        {/* MAIN */}
        <div className="flex  bg-zinc-950" style={{ height: 'calc(100vh - 64px)'}}>
          {/* ASIDE */}
          <aside className="w-52 bg-zinc-900 text-white">
            <nav className="flex flex-col items-center mt-8 space-y-4">
              <Link href="/" className="text-white">Home</Link>
              <Link href="/new" className="text-white">Novo</Link>
            </nav>
          </aside>
          {/* MAIN */}
          <main className="flex-1 flex bg-zinc-800 text-white justify-center">
  <div className="m-6 w-3/5 flex flex-col bg-zinc-200 p-6 rounded-lg space-y-5 text-black" style={{ height: 'calc(100vh - 112px)', overflowY: 'auto' }}>
    {children}
  </div>
</main>

  
        </div>
      </div>
  
    )
}

export default SideBar