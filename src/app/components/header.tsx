import { Search, Bell, Menu, Command } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-[#0A192F] border-b border-[#233554] z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left: Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-[#112240] rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-xl">GaliGali</span>
            <span className="text-[#64FFDA] font-semibold text-xl">Nexus</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Partners, Device IDs, or Tracking numbers..."
              className="w-full bg-[#112240] text-white placeholder-gray-400 pl-10 pr-24 py-2.5 rounded-lg border border-[#233554] focus:outline-none focus:border-[#64FFDA] transition-colors"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right: Status, Notifications, Profile */}
        <div className="flex items-center gap-6">
          {/* System Status */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm text-gray-300">All Systems Live</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-[#112240] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D4D] rounded-full"></span>
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm text-white font-medium">Admin</div>
              <div className="text-xs text-gray-400">GaliGali Internal</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#64FFDA] flex items-center justify-center">
              <span className="text-[#0A192F] font-semibold text-sm">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
