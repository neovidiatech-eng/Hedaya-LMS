import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  updateSchedule,
  createSchedule,
  createRecurringSchedule,
  deleteSchedule,
  deleteRecurringScheduale,
  joinSchedule,
  leaveSchedule,
} from "../services/SchedulesServices";
import {
  UpdateSchedulePayload,
  CreateSchedulePayload,
  CreateRecurringSchedulePayload,
} from "../../../types/scheduales";
import {
  getAllSchedules,
  searchSchedules,
  getSchedulesForTeacher,
} from "../services/SessionsServices";
import { message } from "antd";

const getErrorMessage = (error: any): string => {
  const serverMessage = error?.response?.data?.message;
  if (serverMessage) {
    switch (serverMessage) {
      case 'STUDENT_ID_REQUIRED':
        return 'مطلوب تحديد طالب واحد على الأقل (Student ID required)';
      case 'EXCEEDED_MAX_STUDENTS':
        return 'عدد الطلاب أعلى من السعة القصوى للجلسة (Exceeded max students capacity)';
      case 'INSUFFICIENT_SESSIONS':
        return 'رصيد الجلسات غير كافٍ لواحد أو أكثر من الطلاب (Insufficient remaining sessions)';
      case 'STUDENT_NOT_FOUND':
        return 'تعذر العثور على بيانات إحدى الطلاب (Student not found)';
      case 'STUDENT_CONFLICT':
        return 'يوجد تعارض في مواعيد أحد الطلاب (Student timing conflict)';
      case 'TEACHER_CONFLICT':
        return 'يوجد تعارض في مواعيد المعلم (Teacher timing conflict)';
      default:
        return serverMessage;
    }
  }
  return error?.message || 'حدث خطأ أثناء العملية';
};

export const useGetSchedules = (
  page: number = 1,
  limit: number = 10,
  filters: {
    fromDate?: string;
    toDate?: string;
  } = {},
) => {
  return useQuery({
    queryKey: ["schedules", page, limit, filters],
    queryFn: () => getAllSchedules(page, limit, filters),
  });
};

export const useSearchSchedules = (
  searchTerm: string,
  page: number = 1,
  limit: number = 10,
  filters: {
    fromDate?: string;
    toDate?: string;
  } = {},
) => {
  return useQuery({
    queryKey: ["schedules", searchTerm, page, limit, filters],
    queryFn: () =>
      searchTerm
        ? searchSchedules(searchTerm, page, limit, filters)
        : getAllSchedules(page, limit, filters),
  });
};

export const useGetSchedulesByTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: ["schedules", "teacher", teacherId],
    queryFn: () => getSchedulesForTeacher(teacherId),
    enabled: !!teacherId,
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSchedulePayload) => createSchedule(data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success(data.message || 'Schedule Created Successfully');
    },
    onError: (error: any) => {
      message.error(getErrorMessage(error));
    },
  });
};

export const useCreateRecurringSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecurringSchedulePayload) =>
      createRecurringSchedule(data),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success(data.message || 'Recurring Schedules Created Successfully');
    },
    onError: (error: any) => {
      message.error(getErrorMessage(error));
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success(data.message || 'Schedule Deleted Successfully');
    },
    onError: (error: any) => {
      message.error(getErrorMessage(error));
    },
  });
};

export const useDeleteGroupedSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecurringScheduale(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success(data.message || 'Grouped Schedule Deleted Successfully');
    },
    onError: (error: any) => {
      message.error(getErrorMessage(error));
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSchedulePayload }) =>
      updateSchedule(id, data),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success(data.message || 'Schedule Updated Successfully');
    },
    onError: (error: any) => {
      message.error(getErrorMessage(error));
    },
  });
};

export const useJoinSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => joinSchedule(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success(data.message || 'Joined Session Successfully');
    },
    onError: (error: any) => {
      message.error(getErrorMessage(error));
    },
  });
};

export const useLeaveSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveSchedule(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      message.success(data.message || 'Left Session Successfully');
    },
    onError: (error: any) => {
      message.error(getErrorMessage(error));
    },
  });
};


