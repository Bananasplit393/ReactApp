export interface Exam {
	id: string;
	examtermin: string;
	courseName: string;
	date: string;
	numberOfQuestions: number;
	examDurationMinutes: number;
	startTime: string;
}

export interface Student {
	id: string;
	examId: string; // Ændret fra "exam" for klarhed
	studentNo: string;
	fullName: string; // Samlet for simplicitet
	order: number; // Til at styre rækkefølgen
	questionNo?: number;
	actualExamDurationMinutes?: number;
	notes?: string;
	grade?: string;
}
