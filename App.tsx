
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import { BadgeCheck, Settings, LayoutGrid, Map as MapIcon, Globe, Layers, Music, Calendar, MessageSquare } from 'lucide-react';

import SystemMonitor from './components/Admin/SystemMonitor';
import LoginScreen from './components/Auth/LoginScreen';
import AccountSwitcher from './components/AccountSwitcher';
import OrganizationDashboard from './components/Teams/OrganizationDashboard';
import PersonalDashboard from './components/Personal/PersonalDashboard';
import TourManager from './components/TourManager';
import NetworkHub from './components/Social/NetworkHub';
import WorkspaceHub from './components/WorkspaceHub';
import DetailDrawer from './components/DetailDrawer';
import ToolsPanel from './components/ToolsPanel'; // Added
import CreateTeamModal from './components/Teams/CreateTeamModal';

// Types
import { Tour, MerchSale, LocationPoint, UserAccount, OrganizationRole } from './types';

const App: React.FC = () => {
  // Global State
  const [isSystemMonitorOpen, setIsSystemMonitorOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<string>('PROFILE');
  const [isInAdminMode, setIsInAdminMode] = useState(false);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);

  // Data State for Components
  const {
    tours, setTours,
    salesHistory, setSalesHistory,
    bands,
    pipelineOpportunities, setPipelineOpportunities
  } = useData();

  const [unlockedWorkspaces, setUnlockedWorkspaces] = useState<string[]>([]); // Added for WorkspaceHub

  const [filteredPoints, setFilteredPoints] = useState<LocationPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<LocationPoint | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.8283, -98.5795]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Auth Context
  const {
    currentUser,
    isAuthenticated,
    isLoading,
    availableAccounts,
    switchAccount,
    logout,
    register,
    createTeam,
    isSuperAdmin
  } = useAuth();

  // Keyboard shortcut for System Monitor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD + SHIFT + Z (or Ctrl + Shift + Z)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        if (isSuperAdmin) {
          setIsSystemMonitorOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSuperAdmin]);

  // Derived Values
  const myOrganizations = availableAccounts.filter(a => a.type === 'ORGANIZATION');

  // Handlers
  const handleMapViewChange = (center: [number, number], zoom: number) => {
    setMapCenter(center);
  };

  const handleCreateTeam = async (name: string) => {
    await createTeam(name);
    setIsCreateTeamOpen(false);
    setNotification("Team Created Successfully");
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToPipeline = (point: LocationPoint) => {
    setNotification(`Added ${point.name} to pipeline`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInitiateMessage = (point: LocationPoint) => {
    setNotification(`Drafting message to ${point.name}...`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleWorkspaceUnlock = (role: string) => {
    setUnlockedWorkspaces(prev => [...prev, role]);
  };

  // Render Loading
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render Login
  if (!isAuthenticated || !currentUser) {
    return <LoginScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden text-gray-200">

      {isSystemMonitorOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute top-4 right-4 z-[10000]">
            <button onClick={() => setIsSystemMonitorOpen(false)} className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xs uppercase">Close Monitor</button>
          </div>
          <SystemMonitor />
        </div>
      )}

      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[2000] bg-white text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce border border-white/20">
          <BadgeCheck size={16} className="text-emerald-500" />
          <span className="text-xs font-black uppercase tracking-widest">{notification}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {currentUser.type === 'ORGANIZATION' ? (
          <main className="flex-1 relative flex overflow-hidden bg-black">
            {/* Sidebar for Switching Back from Org View */}
            <nav className="w-20 md:w-64 border-r border-gray-800 flex flex-col bg-gray-950/50 shrink-0">
              <div className="p-4 flex-1">
                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
                  <h3 className="text-xs font-bold text-white mb-1">Organization</h3>
                  <p className="text-[10px] text-gray-500">Managing {currentUser.name}</p>
                </div>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 text-gray-500 hover:text-white transition-all"
                  onClick={() => setIsInAdminMode(true)}
                >
                  <Settings size={16} />
                  <span className="hidden md:block text-xs font-black uppercase tracking-widest">Org Settings</span>
                </button>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => setActiveTab('PROFILE')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PROFILE' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                  >
                    <LayoutGrid size={20} />
                    <span className="hidden md:block text-sm uppercase tracking-tight">Dashboard</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('TOURS')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'TOURS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                  >
                    <MapIcon size={20} />
                    <span className="hidden md:block text-sm uppercase tracking-tight">Gig Finder</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('NETWORK')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'NETWORK' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                  >
                    <Globe size={20} />
                    <span className="hidden md:block text-sm uppercase tracking-tight">Network</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('WORKSPACES')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'WORKSPACES' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                  >
                    <Layers size={20} />
                    <span className="hidden md:block text-sm uppercase tracking-tight">Workspaces</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('TOOLS')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'TOOLS' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                  >
                    <Settings size={20} />
                    <span className="hidden md:block text-sm uppercase tracking-tight">Tools</span>
                  </button>
                </div>
              </div>

              <div className="p-4 border-t border-gray-900">
                <AccountSwitcher
                  currentUser={currentUser}
                  accounts={availableAccounts}
                  organizations={myOrganizations}
                  onSwitch={(acc) => switchAccount(acc.id)}
                  onAddAccount={(acc) => register(acc.name, acc.email, "password")}
                  onCreateTeam={() => setIsCreateTeamOpen(true)}
                  onSignOut={logout}
                />
              </div>
            </nav>

            <div className="flex-1 overflow-hidden">
              {activeTab === 'PROFILE' ? (
                <OrganizationDashboard team={currentUser} />
              ) : activeTab === 'TOURS' ? (
                <TourManager
                  tours={tours}
                  onUpdateTours={setTours}
                  merchSales={salesHistory}
                  currentUser={currentUser}
                  filteredPoints={filteredPoints}
                  onPointSelect={(p) => setSelectedPoint(p)}
                  mapCenter={mapCenter}
                  onMapViewChange={handleMapViewChange}
                  isDiscovering={isDiscovering}
                  aiResult={aiResult}
                  setAiResult={setAiResult}
                  setMapCenter={setMapCenter}
                  selectedPoint={selectedPoint}
                  onAddToPipeline={handleAddToPipeline}
                />
              ) : activeTab === 'NETWORK' ? (
                <NetworkHub />
              ) : activeTab === 'WORKSPACES' ? (
                <WorkspaceHub
                  unlockedWorkspaces={unlockedWorkspaces}
                  onUnlock={handleWorkspaceUnlock}
                  tours={tours}
                  salesHistory={salesHistory}
                  onUpdateSales={setSalesHistory}
                  currentUser={currentUser}
                  bands={bands}
                  opportunities={pipelineOpportunities}
                  onUpdateOpportunities={setPipelineOpportunities}
                />
              ) : activeTab === 'WORKSPACES' ? (
                <WorkspaceHub
                  unlockedWorkspaces={unlockedWorkspaces}
                  onUnlock={handleWorkspaceUnlock}
                  tours={tours}
                  salesHistory={salesHistory}
                  onUpdateSales={setSalesHistory}
                  currentUser={currentUser}
                  bands={bands}
                  opportunities={pipelineOpportunities}
                  onUpdateOpportunities={setPipelineOpportunities}
                />
              ) : activeTab === 'TOOLS' ? (
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <ToolsPanel />
                </div>
              ) : (
                <OrganizationDashboard team={currentUser} />
              )}

              {/* Global Drawer for Tours/Map */}
              {(activeTab === 'TOURS' || activeTab === 'NETWORK') && (
                <DetailDrawer
                  point={selectedPoint}
                  onClose={() => setSelectedPoint(null)}
                  onMessageInitiate={handleInitiateMessage}
                />
              )}
            </div>
          </main>
        ) : (
          <>
            <nav className="w-20 md:w-64 border-r border-gray-800 flex flex-col bg-gray-950/50 shrink-0">
              <div className="p-4 flex-1 space-y-2">
                <div className="mb-6 px-2">
                  <h1 className="hidden md:block text-xl font-black tracking-tighter text-white">TOURBRIDGER</h1>
                  <p className="hidden md:block text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-none">Control Center</p>
                  <div className="md:hidden flex justify-center"><Music className="text-white" /></div>
                </div>

                <button
                  onClick={() => setActiveTab('PROFILE')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'PROFILE' ? 'bg-white text-black font-black shadow-lg shadow-white/10' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                >
                  <LayoutGrid size={20} />
                  <span className="hidden md:block text-sm uppercase tracking-tight">Dashboard</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-gray-900 hover:text-white"
                  onClick={() => setActiveTab('TOURS')}
                >
                  <MapIcon size={20} />
                  <span className="hidden md:block text-sm uppercase tracking-tight">Gig Finder</span>
                </button>

                <button
                  onClick={() => setActiveTab('WORKSPACES')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'WORKSPACES' ? 'bg-white text-black font-black shadow-lg shadow-white/10' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                >
                  <Layers size={20} />
                  <span className="hidden md:block text-sm uppercase tracking-tight">Workspaces</span>
                </button>

                <button
                  onClick={() => setActiveTab('TOOLS')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'TOOLS' ? 'bg-white text-black font-black shadow-lg shadow-white/10' : 'text-gray-500 hover:bg-gray-900 hover:text-white'}`}
                >
                  <Settings size={20} />
                  <span className="hidden md:block text-sm uppercase tracking-tight">Tools</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
                  onClick={() => setNotification("Global Calendar Coming Soon")}
                >
                  <Calendar size={20} />
                  <span className="hidden md:block text-sm uppercase tracking-tight">Calendar</span>
                </button>

                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
                  onClick={() => setNotification("Global Inbox Coming Soon")}
                >
                  <MessageSquare size={20} />
                  <span className="hidden md:block text-sm uppercase tracking-tight">Inboxes</span>
                </button>
              </div>

              <div className="p-4 border-t border-gray-900">
                <AccountSwitcher
                  currentUser={currentUser}
                  accounts={availableAccounts}
                  organizations={myOrganizations}
                  onSwitch={(acc) => switchAccount(acc.id)}
                  onAddAccount={(acc) => register(acc.name, acc.email, "password")}
                  onCreateTeam={() => setIsCreateTeamOpen(true)}
                  onSignOut={logout}
                />
              </div>
            </nav>

            <main className="flex-1 relative flex overflow-hidden bg-black">
              {activeTab === 'PROFILE' ? (
                <PersonalDashboard user={currentUser} />
              ) : activeTab === 'WORKSPACES' ? (
                <WorkspaceHub
                  unlockedWorkspaces={unlockedWorkspaces}
                  onUnlock={handleWorkspaceUnlock}
                  tours={tours}
                  salesHistory={salesHistory}
                  onUpdateSales={setSalesHistory}
                  currentUser={currentUser}
                  bands={bands}
                  opportunities={pipelineOpportunities}
                  onUpdateOpportunities={setPipelineOpportunities}
                />
              ) : activeTab === 'TOOLS' ? (
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <ToolsPanel />
                </div>
              ) : activeTab === 'TOURS' ? (
                <TourManager
                  tours={tours}
                  onUpdateTours={setTours}
                  merchSales={salesHistory}
                  currentUser={currentUser}
                  filteredPoints={filteredPoints}
                  onPointSelect={(p) => setSelectedPoint(p)}
                  mapCenter={mapCenter}
                  onMapViewChange={handleMapViewChange}
                  isDiscovering={isDiscovering}
                  aiResult={aiResult}
                  setAiResult={setAiResult}
                  setMapCenter={setMapCenter}
                  selectedPoint={selectedPoint}
                  onAddToPipeline={handleAddToPipeline}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600">
                  Select a Tool
                </div>
              )}

              <DetailDrawer
                point={selectedPoint}
                onClose={() => setSelectedPoint(null)}
                onMessageInitiate={handleInitiateMessage}
              />
            </main>
          </>
        )}
      </div>

      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        onCreate={handleCreateTeam}
      />
    </div>
  );
};

export default App;
