
import React, { useState } from 'react';
import { NetworkInterface } from '../types';
import Button from './common/Button';

interface InterfaceSelectionViewProps {
  interfaces: NetworkInterface[];
  onSelectInterface: (iface: NetworkInterface) => void;
  serverIp: string;
  serverPort: string;
}

const InterfaceSelectionView: React.FC<InterfaceSelectionViewProps> = ({ interfaces, onSelectInterface, serverIp, serverPort }) => {
  const [selectedInterfaceId, setSelectedInterfaceId] = useState<string | null>(interfaces.length > 0 ? interfaces[0].id : null);

  const handleSelect = () => {
    if (selectedInterfaceId) {
      const selected = interfaces.find(iface => iface.id === selectedInterfaceId);
      if (selected) {
        onSelectInterface(selected);
      }
    }
  };

  if (interfaces.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Select Interface</h1>
        <p className="text-gray-400">No network interfaces found for server {serverIp}:{serverPort}. Please check server configuration or try connecting again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Select Interface</h1>
      <p className="text-gray-400 mb-6">Choose the network interface you want to use for sending packets. This interface will be the source for all subsequent packet operations from server <span className="font-semibold text-indigo-400">{serverIp}:{serverPort}</span>.</p>
      
      <div className="space-y-4 mb-8">
        {interfaces.map((iface) => (
          <label
            key={iface.id}
            className={`
              flex items-center p-4 border rounded-lg cursor-pointer transition-all
              ${selectedInterfaceId === iface.id ? 'bg-indigo-600 border-indigo-500 shadow-lg' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}
            `}
          >
            <input
              type="radio"
              name="interface"
              value={iface.id}
              checked={selectedInterfaceId === iface.id}
              onChange={() => setSelectedInterfaceId(iface.id)}
              className="form-radio h-5 w-5 text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-400 focus:ring-offset-gray-800"
            />
            <div className="ml-4">
              <span className={`block font-semibold ${selectedInterfaceId === iface.id ? 'text-white' : 'text-gray-100'}`}>{iface.name}</span>
              <span className={`block text-sm ${selectedInterfaceId === iface.id ? 'text-indigo-200' : 'text-gray-400'}`}>{iface.description}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSelect} variant="primary" size="lg" disabled={!selectedInterfaceId}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InterfaceSelectionView;
