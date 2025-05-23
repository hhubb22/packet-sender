import React, { useState } from 'react';
import { Packet } from '../../../types';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import ClipboardIcon from '../../icons/ClipboardIcon';

interface PacketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  packet: Packet | null;
}

const PacketDetailsModal: React.FC<PacketDetailsModalProps> = ({ isOpen, onClose, packet }) => {
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedBinary, setCopiedBinary] = useState(false);

  if (!packet) return null;

  const copyToClipboard = (text: string, type: 'hex' | 'binary') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'hex') {
        setCopiedHex(true);
        setTimeout(() => setCopiedHex(false), 2000);
      } else {
        setCopiedBinary(true);
        setTimeout(() => setCopiedBinary(false), 2000);
      }
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      // Potentially show an error message to the user
      alert('Failed to copy text to clipboard.');
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Packet Details: ${packet.id.substring(0,15)}${packet.id.length > 15 ? '...' : ''}`} size="3xl">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-200 mb-2">Hexadecimal Representation</h4>
          <div className="relative p-3 bg-gray-900 rounded-md font-mono text-sm text-gray-300 break-all max-h-48 overflow-y-auto">
            <pre><code>{packet.hexData}</code></pre>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(packet.hexData, 'hex')}
              title="Copy Hex Data"
              aria-label="Copy Hexadecimal Data"
            >
              {copiedHex ? 'Copied!' : <ClipboardIcon className="w-4 h-4"/>}
            </Button>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-200 mb-2">Binary Representation</h4>
          <div className="relative p-3 bg-gray-900 rounded-md font-mono text-sm text-gray-300 break-all max-h-48 overflow-y-auto">
            <pre><code>{packet.binaryData}</code></pre>
             <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(packet.binaryData, 'binary')}
              title="Copy Binary Data"
              aria-label="Copy Binary Data"
            >
              {copiedBinary ? 'Copied!' : <ClipboardIcon className="w-4 h-4"/>}
            </Button>
          </div>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div><strong className="text-gray-400">Source:</strong> <span className="break-all">{packet.source}</span></div>
            <div><strong className="text-gray-400">Destination:</strong> <span className="break-all">{packet.destination}</span></div>
            <div><strong className="text-gray-400">Protocol:</strong> {packet.protocol}</div>
            {packet.length !== undefined && <div><strong className="text-gray-400">Length:</strong> {packet.length} bytes</div>}
            {packet.timestamp && <div><strong className="text-gray-400">Timestamp:</strong> {packet.timestamp}</div>}
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default PacketDetailsModal;