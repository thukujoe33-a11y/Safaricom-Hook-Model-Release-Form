
import type { Submission } from '../types';

// Mock database
const mockSubmissions: Submission[] = [
    {
        id: 'REF-1689345001',
        surname: 'Doe',
        otherNames: 'John',
        poBox: '12345',
        town: 'Nairobi',
        telephone: '0712345678',
        email: 'john.doe@example.com',
        idNumber: '12345678',
        eventName: 'Youth Summit 2024',
        eventLocation: 'KICC',
        date: '2024-07-15',
        timestamp: new Date('2024-07-15T10:30:00Z').toISOString(),
    },
    {
        id: 'REF-1689345002',
        surname: 'Smith',
        otherNames: 'Jane',
        poBox: '54321',
        town: 'Mombasa',
        telephone: '0787654321',
        email: 'jane.smith@example.com',
        idNumber: '87654321',
        eventName: 'Tech Conference',
        eventLocation: 'Sarova Whitesands',
        date: '2024-07-16',
        timestamp: new Date('2024-07-16T11:00:00Z').toISOString(),
    }
];

// Mock API functions
export const submitForm = async (formData: Omit<Submission, 'id' | 'timestamp'>): Promise<{ success: true; referenceId: string }> => {
    console.log('Submitting form data:', formData);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newId = `REF-${Date.now()}`;
            const newSubmission: Submission = {
                ...formData,
                id: newId,
                timestamp: new Date().toISOString(),
            };
            mockSubmissions.push(newSubmission);
            resolve({ success: true, referenceId: newId });
        }, 1500);
    });
};

export const adminLogin = async (email: string, password: string): Promise<{ success: boolean }> => {
    console.log('Admin login attempt:', email);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === 'admin@safaricom.co.ke' && password === 'password123') {
                resolve({ success: true });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1000);
    });
};

export const getSubmissions = async (): Promise<Submission[]> => {
    console.log('Fetching all submissions.');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockSubmissions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }, 1000);
    });
};
