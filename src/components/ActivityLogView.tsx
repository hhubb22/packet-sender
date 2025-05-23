
import React from 'react';
import { LogEntry } from '../types';

interface ActivityLogViewProps {
  logs: LogEntry[];
}

const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
  return (
    <div className="container mx-auto mt-8 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Activity Log</h1>
      {logs.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <p className="text-gray-400">No activities logged yet.</p>
        </div>
      ) : (
        <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {logs.slice().reverse().map((log) => ( // Display newest first
                  <tr key={log.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogView;
