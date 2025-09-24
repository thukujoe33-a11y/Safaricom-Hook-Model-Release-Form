
import React, { useState, useEffect, useMemo } from 'react';
import type { Submission } from '../types';
import { getSubmissions } from '../services/api';

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterEvent, setFilterEvent] = useState('');

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const data = await getSubmissions();
                setSubmissions(data);
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    const filteredSubmissions = useMemo(() => {
        return submissions.filter(sub => {
            const fullName = `${sub.otherNames} ${sub.surname}`.toLowerCase();
            const searchMatch = searchTerm === '' || fullName.includes(searchTerm.toLowerCase()) || sub.email.toLowerCase().includes(searchTerm.toLowerCase());
            const dateMatch = filterDate === '' || sub.date === filterDate;
            const eventMatch = filterEvent === '' || sub.eventName.toLowerCase().includes(filterEvent.toLowerCase());
            return searchMatch && dateMatch && eventMatch;
        });
    }, [submissions, searchTerm, filterDate, filterEvent]);

    const eventNames = useMemo(() => [...new Set(submissions.map(s => s.eventName))], [submissions]);

    if (isLoading) {
        return <div className="text-center p-10">Loading submissions...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-safaricom-dark">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safaricom-green"
                />
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safaricom-green"
                />
                <select 
                    value={filterEvent} 
                    onChange={e => setFilterEvent(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-safaricom-green"
                >
                    <option value="">All Events</option>
                    {eventNames.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>

            <div className="flex justify-end gap-2 mb-4">
                 <button onClick={() => alert('Exporting to CSV...')} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 text-sm">
                    Export CSV
                </button>
                <button onClick={() => alert('Downloading PDF archive...')} className="bg-safaricom-dark text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm">
                    Download All as PDF
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Signed</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                            <tr key={sub.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.otherNames} {sub.surname}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.eventName} ({sub.eventLocation})</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sub.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => alert(`Downloading PDF for ${sub.otherNames} ${sub.surname}...`)} className="text-safaricom-green hover:text-green-700">View/Download PDF</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No submissions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
