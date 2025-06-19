import type { Exam } from "./Exam";
import type { Student } from "./Student";

export interface DbData {
	exams: Exam[];
	students: Student[];
}
