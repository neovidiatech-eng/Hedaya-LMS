import { useQuery } from "@tanstack/react-query"
import { getMyStudents } from "../services/MyStusentsServices"

export const useMyStudents = () => {
    const role = localStorage.getItem("role");
    return useQuery({
        queryKey: ['my-students'],
        queryFn: getMyStudents,
        enabled: role === 'teacher' || role === 'Teacher',
    });
};