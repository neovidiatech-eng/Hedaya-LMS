import { Currency } from './currency';

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

export interface TeacherStatsUser {
    id: string;
    email: string;
    nationality: string | null;
    country: string | null;
    password?: string;
    name: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
    confirmAt: string | null;
    roleId: string | null;
    code_country: string;
    status: string;
    googleId: string | null;
    provider: string;
    timezone: string;
    fcmToken: string;
    notes: string;
    wallet: TeacherWallet[];
}

export interface TeacherStats {
    id: string;
    user_id: string;
    currencyId: string;
    hour_price: number;
    meeting_link: string;
    gender: 'male' | 'female' | 'Male' | 'Female';
    active: boolean;
    roleId: string | null;
    createdAt: string;
    updatedAt: string;
    avgRating: number;
    totalReviews: number;
    user: TeacherStatsUser;
    currency: Currency;
    teacherSubjects: TeacherSubject[];
    WithdrawalsResult: TeacherWithdrawal[];
    completedSessionsCount: number;
}

export interface TeacherStatsResponse {
    message: string;
    status: number;
    lang?: string;
    data: TeacherStats;
}

