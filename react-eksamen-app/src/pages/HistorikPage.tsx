import { useState, useEffect, useMemo } from "react";
import type { Exam, Student } from "../types/data";
import { fetchAllData } from "../api/examApi";
import styles from "./HistorikPage.module.css";

const HistorikPage = () => {
	const [exams, setExams] = useState<Exam[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Hent data fra API'et, når komponenten indlæses første gang
	useEffect(() => {
		const loadData = async () => {
			setIsLoading(true);
			const { exams, students } = await fetchAllData();
			setExams(exams);
			setStudents(students);
			setIsLoading(false);
		};
		loadData();
	}, []); // Det tomme afhængighedsarray [] sikrer, at effekten kun kører én gang

	// Find den valgte eksamen baseret på ID
	const selectedExam = exams.find((exam) => exam.id === selectedExamId);

	// Filtrer studerende, der hører til den valgte eksamen.
	const filteredStudents = useMemo(() => {
		if (!selectedExamId) return [];
		return students
			.filter((student) => student.examId === selectedExamId)
			.sort((a, b) => a.order - b.order); // Sorter efter rækkefølge
	}, [selectedExamId, students]);

	// Beregn gennemsnittet for den valgte eksamen.
	const averageGrade = useMemo(() => {
		const studentsWithGrades = filteredStudents.filter(
			(s) => s.grade && !isNaN(Number(s.grade))
		);
		if (studentsWithGrades.length === 0) return "N/A";

		const total = studentsWithGrades.reduce(
			(sum, student) => sum + Number(student.grade!),
			0
		);
		return (total / studentsWithGrades.length).toFixed(2);
	}, [filteredStudents]);

	if (isLoading) {
		return <div>Indlæser data...</div>;
	}

	return (
		<div className={styles.container}>
			<h1>Eksamenshistorik</h1>

			<div className={styles.selectionArea}>
				<h2>Vælg en eksamen for at se historik</h2>
				{exams.length > 0 ? (
					<select
						onChange={(e) => setSelectedExamId(e.target.value)}
						value={selectedExamId || ""}
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
				) : (
					<p>Ingen eksamener fundet. Opret en ny for at komme i gang.</p>
				)}
			</div>

			{selectedExam && (
				<div className={styles.detailsArea}>
					<h2>Resultater for {selectedExam.courseName}</h2>
					<p>
						<strong>Gennemsnitskarakter: {averageGrade}</strong>
					</p>

					<table className={styles.studentTable}>
						<thead>
							<tr>
								<th>Studienr.</th>
								<th>Navn</th>
								<th>Trukket Sp.</th>
								<th>Eksamenstid</th>
								<th>Karakter</th>
								<th>Noter</th>
							</tr>
						</thead>
						<tbody>
							{filteredStudents.map((student) => (
								<tr key={student.id}>
									<td>{student.studentNo}</td>
									<td>{student.fullName}</td>
									<td>{student.questionNo || "-"}</td>
									<td>
										{student.actualExamDurationMinutes
											? `${student.actualExamDurationMinutes} min`
											: "-"}
									</td>
									<td>{student.grade || "-"}</td>
									<td className={styles.notesCell}>{student.notes || "-"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default HistorikPage;
