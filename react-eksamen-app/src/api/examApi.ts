import type { Exam, Student } from "../types/data";

// Sæt den korrekte URL til din json-server
const API_BASE_URL = "http://localhost:3001";

interface DbData {
	exams: Exam[];
	students: Student[];
}

export const fetchAllData = async (): Promise<DbData> => {
	try {
		const [examsResponse, studentsResponse] = await Promise.all([
			fetch(`${API_BASE_URL}/exams`),
			fetch(`${API_BASE_URL}/students`),
		]);

		if (!examsResponse.ok || !studentsResponse.ok) {
			throw new Error(`HTTP error! Kunne ikke hente data.`);
		}

		const exams: Exam[] = await examsResponse.json();
		const students: Student[] = await studentsResponse.json();

		return { exams, students };
	} catch (error) {
		console.error("Could not fetch data:", error);
		return { exams: [], students: [] };
	}
};

export const saveExam = async (exam: Omit<Exam, "id">): Promise<Exam> => {
	const response = await fetch(`${API_BASE_URL}/exams`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(exam),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const newExam = await response.json();
	return newExam;
};

export const saveStudent = async (
	student: Omit<Student, "id">
): Promise<Student> => {
	const response = await fetch(`${API_BASE_URL}/students`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(student),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};

export const updateStudent = async (student: Student): Promise<Student> => {
	const response = await fetch(`${API_BASE_URL}/students/${student.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(student),
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
};
