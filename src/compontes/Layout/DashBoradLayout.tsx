
import { useContext } from 'react';
import type { ReactNode } from 'react';
import { UserContext } from '../../context/UserContext';
import NavBar from './NavBar';
import SideMenu from './SideMenu';

interface DashboardLayoutProps {
  children: ReactNode;
  activeMenu: string;
}

const DashboardLayout = ({
  children,
  activeMenu,
}: DashboardLayoutProps) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen max-w-full p-0 m-0">
      {user && (
        <div className="flex min-h-screen">
          <aside className="hidden min-[1081px]:block w-60 shrink-0">
            <SideMenu activeMenu={activeMenu} />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col px-4 pr-0">
            <NavBar activeMenu={activeMenu} />

            <main className="flex-1 px-5 py-5">
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
