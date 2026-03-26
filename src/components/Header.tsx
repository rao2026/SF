import { User } from 'lucide-react';
import headerIcon from 'figma:asset/10d1dce494f33f3221373f3dba243a0390247c88.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface HeaderProps {
  onDashboardClick?: () => void;
}

export function Header({ onDashboardClick }: HeaderProps) {
  const handleDashboard = () => {
    if (onDashboardClick) {
      onDashboardClick();
    }
  };

  const handleLogout = () => {
    // Handle logout - for now just log
    console.log('Logout clicked');
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="w-[90%] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left Side */}
          <div className="flex items-center gap-6">
            <img 
              src={headerIcon} 
              alt="Velocity" 
              className="h-3 w-auto object-contain" 
            />
            <div className="h-8 w-px bg-gray-300" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold" style={{ 
                background: 'linear-gradient(to right, #284497 10%, #e64244 40%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Site Feasibility
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 text-[14px]">
                Protocol and feasibility analysis to ideal site profile
              </p>
            </div>
          </div>

          {/* User Menu - Right Side */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center border-0 bg-transparent p-0 outline-none cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#284497] to-[#35bdd4] flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-xl border-gray-200/50 z-[100]">
              <DropdownMenuItem 
                onClick={handleDashboard}
                className="cursor-pointer text-gray-700 hover:text-[#284497] hover:bg-gray-100/80"
              >
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-gray-700 hover:text-[#e64244] hover:bg-gray-100/80"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}