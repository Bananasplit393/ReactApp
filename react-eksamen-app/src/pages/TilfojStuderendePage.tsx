import { useState, useEffect, useMemo } from "react";
import type { Exam, Student } from "../types/data";
import { fetchAllData, saveStudent } from "../api/examApi";
import styles from "../styles/TilfojStuderendePage.module.css";

const TilfojStuderendePage = () => {
	const [exams, setExams] = useState<Exam[]>([]);
	const [allStudents, setAllStudents] = useState<Student[]>([]);
	const [selectedExamId, setSelectedExamId] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Form state
	const [studentNo, setStudentNo] = useState("");
	const [fullName, setFullName] = useState("");

	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			const { exams, students } = await fetchAllData();
			setExams(exams);
			setAllStudents(students);
			setIsLoading(false);
		};
		loadData();
	}, []);

	const studentsForSelectedExam = useMemo(() => {
		return allStudents
			.filter((student) => student.examId === selectedExamId)
			.sort((a, b) => a.order - b.order);
	}, [selectedExamId, allStudents]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedExamId || !studentNo || !fullName) {
			alert("Vælg venligst en eksamen og udfyld både studienummer og navn.");
			return;
		}

		const newStudent: Omit<Student, "id"> = {
			examId: selectedExamId,
			studentNo,
			fullName,
			order: studentsForSelectedExam.length + 1,
		};

		try {
			const savedStudent = await saveStudent(newStudent);
			setAllStudents((prev) => [...prev, savedStudent]); // Opdater UI
			// Nulstil form
			setStudentNo("");
			setFullName("");
		} catch (error) {
			console.error("Failed to save student:", error);
			alert("Der skete en fejl under lagring af den studerende.");
		}
	};

	if (isLoading) {
		return <div>Indlæser data...</div>;
	}

	return (
		<div className={styles.container}>
			<h1>Tilføj Studerende til Eksamen</h1>

			<div className={styles.selectionArea}>
				<h2>1. Vælg Eksamen</h2>
				<select
					onChange={(e) => setSelectedExamId(e.target.value)}
					value={selectedExamId}
					className={styles.examSelect}
				>
					<option value="" disabled>
						-- Vælg en eksamen --
					</option>
					{exams.map((exam) => (
						<option key={exam.id} value={exam.id}>
							{exam.courseName} - {exam.examtermin}
						</option>
					))}
				</select>
			</div>

			{selectedExamId && (
				<div className={styles.formArea}>
					<h2>2. Tilføj Studerende</h2>
					<form onSubmit={handleSubmit} className={styles.studentForm}>
						<div className={styles.formGroup}>
							<label htmlFor="studentNo">Studienummer</label>
							<input
								type="text"
								id="studentNo"
								value={studentNo}
								onChange={(e) => setStudentNo(e.target.value)}
								required
							/>
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="fullName">Fulde Navn</label>
							<input
								type="text"
								id="fullName"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
							/>
						</div>
						<button type="submit" className={styles.addButton}>
							Tilføj Studerende
						</button>
					</form>

					<div className={styles.studentList}>
						<h3>Tilmeldte Studerende (i rækkefølge)</h3>
						{studentsForSelectedExam.length > 0 ? (
							<ol>
								{studentsForSelectedExam.map((student) => (
									<li key={student.id}>
										{student.fullName} ({student.studentNo})
									</li>
								))}
							</ol>
						) : (
							<p>Ingen studerende er tilføjet endnu.</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default TilfojStuderendePage;
