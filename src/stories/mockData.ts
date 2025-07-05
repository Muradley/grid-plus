export type Person = {
    id: number;
    name: string;
    email: string;
    age: number;
    status: 'active' | 'inactive' | 'pending';
    salary: number;
    department: string;
    startDate: Date;
    isManager: boolean;
};

export const createMockData = (count: number): Person[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `Person ${i + 1}`,
        email: `person${i + 1}@example.com`,
        age: 22 + (i % 45),
        status: ['active', 'inactive', 'pending'][i % 3] as
            | 'active'
            | 'inactive'
            | 'pending',
        salary: 40000 + (i % 2000) * 40,
        department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][
            i % 5
        ],
        startDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1),
        isManager: i % 7 === 0,
    }));
