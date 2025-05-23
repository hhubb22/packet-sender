
import React, { useState } from 'react';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';

interface ServerSelectionViewProps {
  onConnect: (ip: string, port: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ServerSelectionView: React.FC<ServerSelectionViewProps> = ({ onConnect, isLoading, error }) => {
  const [ipAddress, setIpAddress] = useState('127.0.0.1');
  const [port, setPort] = useState('8080');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    if (!ipAddress.trim() || !port.trim()) {
      setValidationError('Both IP Address and Port Number are required.');
      return;
    }
    // Basic IP validation (can be improved)
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      setValidationError('Invalid IP Address format.');
      return;
    }
    // Basic Port validation
    const portNum = parseInt(port, 10);
    if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
      setValidationError('Invalid Port Number (must be 1-65535).');
      return;
    }
    onConnect(ipAddress, port);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center text-gray-100 mb-8">Server Selection</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Server IP Address"
          id="ipAddress"
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="Enter IP Address (e.g., 192.168.1.100)"
          disabled={isLoading}
        />
        <Input
          label="Port Number"
          id="port"
          type="text"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Enter Port Number (e.g., 8080)"
          disabled={isLoading}
        />
        {validationError && <p className="text-sm text-red-400">{validationError}</p>}
        {error && <p className="text-sm text-red-400">Connection failed: {error}</p>}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" color="text-white" className="mr-2"/> : null}
            {isLoading ? 'Connecting...' : 'Connect'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServerSelectionView;
