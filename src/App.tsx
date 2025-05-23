// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import ServerSelectionView from './components/views/ServerSelectionView';
import InterfaceSelectionView from './components/views/InterfaceSelectionView';
import PacketEditorView from './components/views/PacketEditorView';
import ActivityLogView from './components/views/ActivityLogView';
import { AppView, LogEntry, NetworkInterface, Packet } from './types';
import { MOCK_INTERFACES } from './constants';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.SERVER_SELECTION);
  const [serverInfo, setServerInfo] = useState<{ ip: string; port: string; connected: boolean } | null>(null);
  const [networkInterfaces, setNetworkInterfaces] = useState<NetworkInterface[]>([]);
  const [selectedInterface, setSelectedInterface] = useState<NetworkInterface | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync currentView with router path
    const pathMap: { [key: string]: AppView } = {
      '/server': AppView.SERVER_SELECTION,
      '/interface': AppView.INTERFACE_SELECTION,
      '/editor': AppView.PACKET_EDITOR,
      '/logs': AppView.LOGS,
    };
    const newView = pathMap[location.pathname] || AppView.SERVER_SELECTION;
    if (newView !== currentView) {
      setCurrentView(newView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Effect to navigate after server connection
  useEffect(() => {
    if (serverInfo?.connected && location.pathname === '/server') {
      navigate('/interface');
    }
  }, [serverInfo, location.pathname, navigate]);

  // Effect to navigate after interface selection
  useEffect(() => {
    if (selectedInterface && location.pathname === '/interface') {
      navigate('/editor');
    }
  }, [selectedInterface, location.pathname, navigate]);


  const addLogEntry = useCallback((action: string, details: string) => {
    setLogs(prevLogs => [
      ...prevLogs,
      { id: Date.now().toString(), timestamp: new Date().toLocaleString(), action, details },
    ]);
  }, []);

  const handleNavigate = (view: AppView) => {
    if (view === AppView.SERVER_SELECTION) {
      if (serverInfo?.connected) {
        addLogEntry('Server Disconnected', `Disconnected from ${serverInfo.ip}:${serverInfo.port}. Returning to server selection.`);
      } else {
        addLogEntry('Navigation', `Navigating to Server Selection.`);
      }
      setServerInfo(null);
      setNetworkInterfaces([]);
      setSelectedInterface(null);
      setError(null); 
      setCurrentView(AppView.SERVER_SELECTION); 
      navigate('/server');
    } else if (view === AppView.INTERFACE_SELECTION) {
      if (serverInfo?.connected) {
        if (selectedInterface) {
          addLogEntry('Interface Deselected', `Returning to interface selection. Previously selected: ${selectedInterface.name}.`);
          setSelectedInterface(null); // Reset selected interface
        } else {
          addLogEntry('Navigation', `Navigating to Interface Selection.`);
        }
        setCurrentView(AppView.INTERFACE_SELECTION);
        navigate('/interface');
      }
      // If server not connected, header button should be disabled.
    } else if (view === AppView.PACKET_EDITOR) {
      if (selectedInterface) { // Only navigate if an interface is actually selected
        addLogEntry('Navigation', `Navigating to Packet Editor.`);
        setCurrentView(AppView.PACKET_EDITOR);
        navigate('/editor');
      }
      // If interface not selected, header button should be disabled.
    } else if (view === AppView.LOGS) {
      addLogEntry('Navigation', `Navigating to Logs.`);
      setCurrentView(AppView.LOGS);
      navigate('/logs');
    } else {
      // Fallback: Should not happen with current NAV_ITEMS
      if (serverInfo?.connected) {
         addLogEntry('Navigation Reset', `Unexpected navigation state. Returning to server selection.`);
      }
      setServerInfo(null);
      setNetworkInterfaces([]);
      setSelectedInterface(null);
      setError(null);
      setCurrentView(AppView.SERVER_SELECTION);
      navigate('/server');
    }
  };

  const handleConnectServer = async (ip: string, port: string) => {
    setIsLoading(true);
    setError(null);
    addLogEntry('Connection Attempt', `Trying to connect to ${ip}:${port}...`);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    if (ip === '0.0.0.0') { 
        setError('Invalid server address.');
        addLogEntry('Connection Failed', `Failed to connect to ${ip}:${port}. Error: Invalid address.`);
        setIsLoading(false);
        setServerInfo(null); 
        setNetworkInterfaces([]);
        setSelectedInterface(null);
        return;
    }

    setServerInfo({ ip, port, connected: true });
    setNetworkInterfaces(MOCK_INTERFACES); 
    addLogEntry('Server Connected', `Successfully connected to ${ip}:${port}.`);
    setIsLoading(false);
  };

  const handleSelectInterface = (iface: NetworkInterface) => {
    setSelectedInterface(iface);
    addLogEntry('Interface Selected', `Interface ${iface.name} (${iface.description}) selected.`);
  };

  const handleSendPacket = async (packet: Packet, type: 'manual' | 'pcap') => {
    addLogEntry(`Packet Sending (${type})`, `Attempting to send packet ID: ${packet.id.substring(0,10)}...`);
    setIsLoading(true); 
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    addLogEntry('Packet Sent', `Packet ID: ${packet.id.substring(0,10)}... sent via ${selectedInterface?.name}. Status: Success (Simulated).`);
    setIsLoading(false);
  };
  
  const handleUploadPcap = async (file: File): Promise<Packet[]> => {
    addLogEntry('PCAP Upload', `Processing file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    addLogEntry('PCAP Processed', `File ${file.name} processed. Packets loaded (Simulated).`);
    // This function in App.tsx is expected to return Packet[] by PacketEditorView
    // but PacketEditorView currently generates its own mock packets after this.
    // For consistency, this could return some mock packets or an empty array if
    // PacketEditorView is self-sufficient in mock data generation.
    // Given PacketEditorView generates its own after "upload", returning [] is fine.
    return []; 
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigate}
        serverConnected={!!serverInfo?.connected}
        interfaceSelected={!!selectedInterface}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/server" element={
            <ServerSelectionView 
                onConnect={handleConnectServer} 
                isLoading={isLoading && currentView === AppView.SERVER_SELECTION} 
                error={currentView === AppView.SERVER_SELECTION ? error : null} 
            />} 
          />
          <Route path="/interface" element={
            serverInfo?.connected ? (
              <InterfaceSelectionView 
                interfaces={networkInterfaces} 
                onSelectInterface={handleSelectInterface}
                serverIp={serverInfo.ip}
                serverPort={serverInfo.port}
              />
            ) : <Navigate to="/server" replace />
          }/>
          <Route path="/editor" element={
             selectedInterface ? (
                <PacketEditorView 
                    onSendPacket={handleSendPacket} 
                    onUploadPcap={handleUploadPcap}
                    selectedInterfaceName={selectedInterface?.name}
                />
             ) : <Navigate to={serverInfo?.connected ? "/interface" : "/server"} replace />
          }/>
          <Route path="/logs" element={<ActivityLogView logs={logs} />} />
          <Route path="*" element={<Navigate to="/server" replace />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-center py-4 text-sm text-gray-500">
        PacketForge &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;