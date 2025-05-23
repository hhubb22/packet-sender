import React, { useState, useCallback, ChangeEvent, DragEvent, useEffect } from 'react';
import { Packet } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import PacketDetailsModal from '../features/PacketEditor/PacketDetailsModal';
import UploadIcon from '../icons/UploadIcon';
import EyeIcon from '../icons/EyeIcon';
import SendIcon from '../icons/SendIcon';
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import ChevronRightIcon from '../icons/ChevronRightIcon';
import SearchIcon from '../icons/SearchIcon';
import Spinner from '../common/Spinner';
import { MOCK_PACKETS_PER_PAGE } from '../../constants';
import { hexToBinary } from '../../utils/packetUtils';


interface PacketEditorViewProps {
  onSendPacket: (packet: Packet, type: 'manual' | 'pcap') => Promise<void>;
  onUploadPcap: (file: File) => Promise<Packet[]>; // Expects Packet[] for potential future parsing
  selectedInterfaceName: string | undefined;
}

// Mock packet generation, can be moved to a util or a mock service if it grows
const generateRandomPackets = (count: number): Packet[] => {
  const protocols = ['TCP', 'UDP', 'ICMP', 'DNS', 'HTTP'];
  return Array.from({ length: count }, (_, i) => {
    const id = `pkt-${Date.now()}-${i}`;
    const sourceIp = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
    const destIp = `10.0.0.${Math.floor(Math.random() * 254) + 1}`;
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const rawHexData = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
    return {
      id,
      source: sourceIp,
      destination: destIp,
      protocol,
      hexData: rawHexData,
      binaryData: hexToBinary(rawHexData), // Use the utility
      timestamp: new Date(Date.now() - Math.random() * 10000000).toLocaleString(),
      length: rawHexData.length / 2,
    };
  });
};


const PacketEditorView: React.FC<PacketEditorViewProps> = ({ onSendPacket, onUploadPcap, selectedInterfaceName }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'pcap'>('manual');
  const [manualHex, setManualHex] = useState('');
  const [pcapPackets, setPcapPackets] = useState<Packet[]>([]);
  const [filteredPackets, setFilteredPackets] = useState<Packet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPacketForModal, setSelectedPacketForModal] = useState<Packet | null>(null); // Renamed for clarity
  const [isUploading, setIsUploading] = useState(false);
  const [isSendingManual, setIsSendingManual] = useState(false); // Specific sending state
  const [sendingPcapPacketId, setSendingPcapPacketId] = useState<string | null>(null); // Specific for pcap list
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = pcapPackets.filter(p => 
      p.id.toLowerCase().includes(lowerSearchTerm) ||
      p.source.toLowerCase().includes(lowerSearchTerm) ||
      p.destination.toLowerCase().includes(lowerSearchTerm) ||
      p.protocol.toLowerCase().includes(lowerSearchTerm) ||
      (p.timestamp && p.timestamp.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredPackets(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, pcapPackets]);

  const totalPages = Math.ceil(filteredPackets.length / MOCK_PACKETS_PER_PAGE);
  const currentDisplayPackets = filteredPackets.slice(
    (currentPage - 1) * MOCK_PACKETS_PER_PAGE,
    currentPage * MOCK_PACKETS_PER_PAGE
  );

  const handleManualSend = async () => {
    const cleanedHex = manualHex.replace(/\s/g, '');
    if (!cleanedHex) {
      alert('Hex data cannot be empty.');
      return;
    }
    if (!/^[0-9a-fA-F]+$/.test(cleanedHex)) {
        alert('Invalid hex data format. Only 0-9 and a-f characters are allowed.');
        return;
    }
    const packet: Packet = {
      id: `manual-${Date.now()}`,
      source: 'N/A (Manual)',
      destination: 'N/A (Manual)',
      protocol: 'RAW',
      hexData: cleanedHex,
      binaryData: hexToBinary(cleanedHex),
      timestamp: new Date().toLocaleString(),
      length: cleanedHex.length / 2,
    };
    setIsSendingManual(true);
    await onSendPacket(packet, 'manual');
    setIsSendingManual(false);
    setManualHex(''); 
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processPcapFile(file);
    }
    event.target.value = ''; // Reset file input
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-indigo-500', 'bg-gray-700');
    event.currentTarget.classList.add('border-gray-600');
    const file = event.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.pcap') || file.name.endsWith('.pcapng'))) {
      await processPcapFile(file);
    } else {
      alert('Please upload a valid .pcap or .pcapng file.');
    }
  };
  
  const processPcapFile = async (file: File) => {
      setIsUploading(true);
      setPcapPackets([]); 
      setFilteredPackets([]);
      setCurrentPage(1);
      try {
        // Call the prop for potential external processing, though we use mock data here
        await onUploadPcap(file); 
        // Simulate delay & generate mock packets as per original behavior
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        const mockPackets = generateRandomPackets(Math.floor(Math.random() * 40) + 10);
        setPcapPackets(mockPackets);
        // setFilteredPackets(mockPackets); // This is handled by useEffect
      } catch (error) {
        console.error("Error processing PCAP file:", error);
        alert("Failed to process PCAP file. See console for details.");
      } finally {
        setIsUploading(false);
      }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('border-indigo-500', 'bg-gray-700');
    event.currentTarget.classList.remove('border-gray-600');
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('border-indigo-500', 'bg-gray-700');
    event.currentTarget.classList.add('border-gray-600');
  };

  const viewPacketDetails = (packet: Packet) => {
    setSelectedPacketForModal(packet);
    setIsModalOpen(true);
  };
  
  const sendPcapPacket = async (packet: Packet) => {
    setSendingPcapPacketId(packet.id);
    await onSendPacket(packet, 'pcap');
    setSendingPcapPacketId(null);
  };

  const TabButton: React.FC<{ tabName: 'manual' | 'pcap'; label: string, onClick: () => void, isActive: boolean }> = ({ tabName, label, onClick, isActive }) => (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${tabName}`}
      id={`tab-${tabName}`}
      className={`px-6 py-3 font-medium text-sm leading-5 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-800
        ${isActive 
          ? 'text-indigo-400 border-b-2 border-indigo-500' 
          : 'text-gray-400 hover:text-gray-200 hover:border-gray-500 border-b-2 border-transparent'
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto mt-8 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Craft and Send Packets</h1>
      <p className="text-gray-400 mb-6">Using interface: <span className="font-semibold text-indigo-400">{selectedInterfaceName || 'N/A'}</span></p>

      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs" role="tablist">
          <TabButton tabName="manual" label="Manual Hex Input" onClick={() => setActiveTab('manual')} isActive={activeTab === 'manual'} />
          <TabButton tabName="pcap" label="Upload PCAP File" onClick={() => setActiveTab('pcap')} isActive={activeTab === 'pcap'} />
        </nav>
      </div>

      {activeTab === 'manual' && (
        <div role="tabpanel" id="tabpanel-manual" aria-labelledby="tab-manual" className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">Enter Hex Data</h2>
          <label htmlFor="manualHexInput" className="sr-only">Manual Hex Input</label>
          <textarea
            id="manualHexInput"
            value={manualHex}
            onChange={(e) => setManualHex(e.target.value)}
            placeholder="Enter hex data for the packet (e.g., 001122aabbcc...)"
            rows={8}
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-200 font-mono focus:ring-indigo-500 focus:border-indigo-500 focus:bg-gray-700"
            disabled={isSendingManual}
            aria-multiline="true"
          />
          <div className="mt-6 flex justify-end">
            <Button onClick={handleManualSend} variant="primary" size="lg" disabled={isSendingManual || !manualHex.replace(/\s/g, '').trim()}>
              {isSendingManual ? <Spinner size="sm" color="text-white" className="mr-2"/> : <SendIcon className="w-5 h-5 mr-2"/>}
              {isSendingManual ? 'Sending...' : 'Send Packet'}
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'pcap' && (
        <div role="tabpanel" id="tabpanel-pcap" aria-labelledby="tab-pcap" className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div 
            className="mb-6 p-8 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-indigo-500 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-400"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById('fileInputPcap')?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('fileInputPcap')?.click();}}
            tabIndex={0}
            role="button"
            aria-label="PCAP file upload area"
          >
            <UploadIcon className="w-12 h-12 mx-auto text-gray-500 mb-3" />
            <p className="text-gray-400 mb-1">Drag and drop a PCAP file here</p>
            <p className="text-sm text-gray-500 mb-3">Or</p>
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); document.getElementById('fileInputPcap')?.click(); }} disabled={isUploading} aria-label="Browse files to upload PCAP">
              {isUploading ? 'Processing...' : 'Browse Files'}
            </Button>
            <input type="file" id="fileInputPcap" className="hidden" onChange={handleFileChange} accept=".pcap,.pcapng" disabled={isUploading}/>
          </div>

          {isUploading && <div className="flex justify-center my-4" aria-live="polite"><Spinner /> <span className="ml-2 text-gray-300">Parsing PCAP file...</span></div>}

          {pcapPackets.length > 0 && !isUploading && (
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-4">Packets Found</h3>
              <div className="mb-4">
                <Input 
                  type="search" 
                  label="Search Packets"
                  id="pcapSearch"
                  placeholder="Search by ID, IP, protocol, or timestamp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<SearchIcon className="w-5 h-5 text-gray-400"/>}
                />
              </div>
              {filteredPackets.length === 0 && <p className="text-center text-gray-400 py-4">No packets found matching your criteria.</p>}
              {filteredPackets.length > 0 && (
                <>
                  <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full divide-y divide-gray-700">
                      <caption className="sr-only">List of packets from PCAP file</caption>
                      <thead className="bg-gray-750">
                        <tr>
                          {['ID', 'Timestamp', 'Source', 'Destination', 'Protocol', 'Length', 'Actions'].map(header => (
                            <th key={header} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {currentDisplayPackets.map((packet) => (
                          <tr key={packet.id} className="hover:bg-gray-750 transition-colors">
                            <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap" title={packet.id}>{packet.id.substring(0,10)}...</td>
                            <td className="px-4 py-3 text-sm text-gray-400 whitespace-nowrap">{packet.timestamp}</td>
                            <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{packet.source}</td>
                            <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{packet.destination}</td>
                            <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{packet.protocol}</td>
                            <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">{packet.length} bytes</td>
                            <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                              <Button variant="ghost" size="sm" onClick={() => viewPacketDetails(packet)} className="mr-2" title="View Packet Details" aria-label={`View details for packet ${packet.id.substring(0,10)}`}>
                                <EyeIcon /> <span className="ml-1 hidden sm:inline">View</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => sendPcapPacket(packet)} disabled={!!sendingPcapPacketId} title="Send This Packet" aria-label={`Send packet ${packet.id.substring(0,10)}`}>
                                {sendingPcapPacketId === packet.id ? <Spinner size="sm" /> : <SendIcon />} <span className="ml-1 hidden sm:inline">Send</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <nav className="mt-4 flex justify-between items-center" aria-label="Packet list pagination">
                      <Button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        variant="secondary"
                        size="sm"
                        leftIcon={<ChevronLeftIcon/>}
                        aria-label="Go to previous page of packets"
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-400" aria-live="polite" aria-atomic="true">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        variant="secondary"
                        size="sm"
                        rightIcon={<ChevronRightIcon/>}
                        aria-label="Go to next page of packets"
                      >
                        Next
                      </Button>
                    </nav>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

      <PacketDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        packet={selectedPacketForModal}
      />
    </div>
  );
};

export default PacketEditorView;