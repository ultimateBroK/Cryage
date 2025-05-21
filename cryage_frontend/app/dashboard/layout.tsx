import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="font-bold">CRYAGE</div>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            {/* Theme switcher and navigation will go here */}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
