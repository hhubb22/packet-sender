
import React, { useState } from 'react';
import { Packet } from '../types';
import Modal from './common/Modal';
import Button from './common/Button';
import ClipboardIcon from './icons/ClipboardIcon';

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
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Packet Details: ${packet.id}`} size="3xl">
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-200 mb-2">Hexadecimal Representation</h4>
          <div className="relative p-3 bg-gray-900 rounded-md font-mono text-sm text-gray-300 break-all max-h-48 overflow-y-auto">
            {packet.hexData}
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(packet.hexData, 'hex')}
              title="Copy Hex Data"
            >
              {copiedHex ? 'Copied!' : <ClipboardIcon className="w-4 h-4"/>}
            </Button>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-200 mb-2">Binary Representation</h4>
          <div className="relative p-3 bg-gray-900 rounded-md font-mono text-sm text-gray-300 break-all max-h-48 overflow-y-auto">
            {packet.binaryData}
             <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(packet.binaryData, 'binary')}
              title="Copy Binary Data"
            >
              {copiedBinary ? 'Copied!' : <ClipboardIcon className="w-4 h-4"/>}
            </Button>
          </div>
        </div>
         <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong className="text-gray-400">Source:</strong> {packet.source}</div>
            <div><strong className="text-gray-400">Destination:</strong> {packet.destination}</div>
            <div><strong className="text-gray-400">Protocol:</strong> {packet.protocol}</div>
            {packet.length && <div><strong className="text-gray-400">Length:</strong> {packet.length} bytes</div>}
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
