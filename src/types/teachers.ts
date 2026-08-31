export interface TeacherSubject {
    id: string;
    teacherId: string;
    subjectId: string;
    createdAt: string;
    updatedAt: string;
    subject: {
        id: string;
        name_en: string;
        name_ar: string;
        active: boolean;
        color: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface TeacherWallet {
    id: string;
    type: string;
    ownerId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    currencyId: string;
    userId: string;
}

export interface TeacherWithdrawal {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    [key: string]: any;
}

export interface TeacherFinancials {
    totalHours?: number;
    hourPrice?: number;
    totalDue?: number;
    totalEarnings?: number;
    completedEarnings?: number;
    completedHours?: number;
    pendingEarnings?: number;
    pendingHours?: number;
    availableBalance?: number;
    pendingWithdrawals?: number;
}

export interface TeacherStats {
    totalStudents?: number;
    completedSessions?: number;
    todaySessions?: number;
    upcomingSessions?: number;
    financials?: TeacherFinancials;
}

export interface Teacher {
    id: string;
    user_id: string;
    currencyId: string;
    hour_price: number;
    gender: 'Male' | 'Female';
    active: boolean;
    createdAt: string;
    updatedAt: string;
    roleId: string | null;
    user: {
        id: string;
        email: string;
        name: string;
        password:string;
        phone: string;
        code_country: string;
        status: string;
        confirmAt: string | null;
        wallet?: TeacherWallet[];
    };
    teacherSubjects: TeacherSubject[];
    meeting_link?: string;
    WithdrawalsResult?: TeacherWithdrawal[];
    completedSessionsCount?: number;
    stats?: TeacherStats;
}

export interface TeachersFetchResponse {
    message: string;
    status: number;
    data: {
        teachers: Teacher[];
        pagination: {
            page: number;
            limit: number;
            totalItems: number;
            totalPages: number;
            hasNextPage: boolean;
        };
        activeCount: number;
        inactiveCount: number;
    };
}

export interface CreateTeacherInput {
    name: string;
    email: string;
    password?: string;
    phone: string;
    code_country: string;
    currency_id: string;
    gender: 'male' | 'female';
    hour_price: number;
    active: boolean;
    subject_ids: string[];
    meeting_link?: string;
    timezone?: string;
}

export interface UpdateTeacherInput {
    name: string;
    email: string;
    password?: string;
    phone: string;
    code_country: string;
    currency_id: string;
    gender: 'male' | 'female';
    hour_price: number;
    active: boolean;
    subject_ids: string[];
    timezone?: string;
    meeting_link?: string;
}

export type TeachersData = TeachersFetchResponse['data'];
