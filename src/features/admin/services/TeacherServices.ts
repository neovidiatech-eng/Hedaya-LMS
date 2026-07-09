import api from "../../../lib/axios"
import { CreateTeacherInput, Teacher, TeachersData, TeachersFetchResponse, UpdateTeacherInput } from "../../../types/teachers"

export interface GetTeachersParams {
    page?: number;
    limit?: number;
    search?: string;
}

export const getTeacher = async (params: GetTeachersParams = {}): Promise<TeachersData> => {
    const { search } = params;
    const queryParams: Record<string, string | number> = {};
    if (search) queryParams.search = search;
    const response = await api.get("/teachers", Object.keys(queryParams).length > 0 ? { params: queryParams } : undefined);
    return response.data.data;
}

export const searchTeacher = async (search: string): Promise<TeachersData> => {
    const response = await api.get(`/teachers?search=${search}`);
    return response.data.data
}

export const getTeacherById = async (id: string): Promise<Teacher> => {
    const response = await api.get(`/teachers/${id}`);
    return response.data.data
}

export const createTeacher = async (data: CreateTeacherInput): Promise<TeachersFetchResponse> => {
    const response = await api.post("/teachers/create", data);
    return response.data
}

export const updateTeacher = async (id: string, data: UpdateTeacherInput): Promise<TeachersFetchResponse> => {
    const response = await api.patch(`/teachers/update/${id}`, data);
    return response.data
}

export const deleteTeacher = async (id: string): Promise<TeachersFetchResponse> => {
    const response = await api.delete(`/teachers/delete/${id}`);
    return response.data
}

export const exportTeacher = async (): Promise<void> => {
    const response = await api.get('/teachers/export', { responseType: 'blob' });
    
    if (response.data.type === 'application/json') {
        const text = await response.data.text();
        console.error("Backend returned JSON instead of a file:", text);
        throw new Error("Error from backend: " + text);
    }

    let filename = `teacher_export_${new Date().toISOString().split('T')[0]}`;
    const disposition = response.headers['content-disposition'];
    
    if (disposition && disposition.includes('attachment')) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
        }
    } else {
        // لو الباك إند مبعتش اسم، بنحدد إحنا الامتداد بناءً على نوع الملف
        if (response.data.type.includes('csv')) {
            filename += '.csv';
        } else {
            filename += '.xlsx';
        }
    }

    const blob = new Blob([response.data], { type: response.data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
