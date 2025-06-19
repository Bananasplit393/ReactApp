import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Exam, Student } from "../types/data";
import { fetchAllData, updateStudent } from "../api/examApi";
import styles from "../styles/StartEksamenPage.module.css";

type ExamStatus =
	| "waiting"
	| "question_drawn"
	| "exam_running"
	| "exam_paused"
	| "grading";

const StartEksamenPage = () => {
	const { examId } = useParams<{ examId: string }>();
	const navigate = useNavigate();

	// Data state
	const [exam, setExam] = useState<Exam | null>(null);
	const [students, setStudents] = useState<Student[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Process state
	const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
	const [status, setStatus] = useState<ExamStatus>("waiting");
	const [drawnQuestion, setDrawnQuestion] = useState<number | null>(null);
	const [notes, setNotes] = useState("");
	const [grade, setGrade] = useState("");

	// Timer state
	const [timeRemaining, setTimeRemaining] = useState(0);
	const timerRef = useRef<number | null>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	// ÉN enkelt definition af formatTime
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	useEffect(() => {
		const loadData = async () => {
			if (!examId) return;
			setIsLoading(true);
			const { exams, students } = await fetchAllData();
			const currentExam = exams.find((e) => e.id === examId);
			const examStudents = students
				.filter((s) => s.examId === examId)
				.sort((a, b) => a.order - b.order);

			if (currentExam && examStudents.length > 0) {
				setExam(currentExam);
				setStudents(examStudents);
				setTimeRemaining(currentExam.examDurationMinutes * 60);
			} else {
				alert("Eksamen ikke fundet eller ingen studerende tilmeldt!");
				navigate("/");
			}
			setIsLoading(false);
		};
		loadData();
	}, [examId, navigate]);

	useEffect(() => {
		if (status === "exam_running" && timeRemaining > 0) {
			timerRef.current = setInterval(() => {
				setTimeRemaining((prev) => prev - 1);
			}, 1000);
		} else if (timeRemaining === 0 && status === "exam_running") {
			if (timerRef.current) clearInterval(timerRef.current);
			setStatus("grading");
			audioRef.current?.play();
			alert("Tiden er gået!");
		}

		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [status, timeRemaining]);

	const handleDrawQuestion = () => {
		if (!exam) return;
		const question = Math.floor(Math.random() * exam.numberOfQuestions) + 1;
		setDrawnQuestion(question);
		setStatus("question_drawn");
	};

	const handleStartExam = () => {
		setStatus("exam_running");
	};

	const handleEndExam = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		setStatus("grading");
	};

	const handleSaveAndNext = async () => {
		if (!grade) {
			alert("Vælg venligst en karakter.");
			return;
		}

		const finalExamTime = exam!.examDurationMinutes * 60 - timeRemaining;
		const updatedStudentData: Student = {
			...currentStudent,
			questionNo: drawnQuestion!,
			actualExamDurationMinutes: Math.round(finalExamTime / 60),
			notes,
			grade,
		};

		try {
			await updateStudent(updatedStudentData);
			console.log("Data gemt for studerende:", updatedStudentData);

			if (currentStudentIndex < students.length - 1) {
				setCurrentStudentIndex((prev) => prev + 1);
				setStatus("waiting");
				setDrawnQuestion(null);
				setNotes("");
				setGrade("");
				setTimeRemaining(exam!.examDurationMinutes * 60);
			} else {
				alert("Eksamen er færdig for alle studerende!");
				navigate("/historik");
			}
		} catch (error) {
			console.error("Kunne ikke gemme data for studerende:", error);
			alert("Der skete en fejl under lagring af resultatet.");
		}
	};

	const currentStudent = students[currentStudentIndex];

	if (isLoading || !exam || !currentStudent) {
		return <div>Indlæser eksamen...</div>;
	}

	// DEN ANDEN (OVERFLØDIGE) DEFINITION ER FJERNET HERFRA

	return (
		<div className={styles.container}>
			<audio ref={audioRef} src="/assets/timer-end.mp3" preload="auto" />
			<div className={styles.header}>
				<h1>{exam.courseName}</h1>
				<h2>
					Eksaminand: {currentStudent.fullName} ({currentStudent.studentNo})
				</h2>
				<div
					className={`${styles.timer} ${
						timeRemaining < 60 ? styles.timerWarning : ""
					}`}
				>
					{formatTime(timeRemaining)}
				</div>
			</div>

			<div className={styles.controls}>
				{status === "waiting" && (
					<button onClick={handleDrawQuestion}>Træk Spørgsmål</button>
				)}
				{status === "question_drawn" && (
					<button onClick={handleStartExam}>Start Eksamination</button>
				)}
				{status === "exam_running" && (
					<button onClick={handleEndExam} className={styles.endButton}>
						Slut Eksamination
					</button>
				)}
				{status === "grading" && (
					<button onClick={handleSaveAndNext} className={styles.nextButton}>
						Gem og Næste Studerende
					</button>
				)}
			</div>

			<div className={styles.details}>
				{drawnQuestion && (
					<p>
						<strong>Trukket spørgsmål: {drawnQuestion}</strong>
					</p>
				)}

				<div className={styles.notesSection}>
					<label htmlFor="notes">Noter til eksaminationen</label>
					<textarea
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						disabled={status === "waiting" || status === "question_drawn"}
						rows={8}
					/>
				</div>

				{status === "grading" && (
					<div className={styles.gradeSection}>
						<label htmlFor="grade">Karakter</label>
						<select
							id="grade"
							value={grade}
							onChange={(e) => setGrade(e.target.value)}
						>
							<option value="" disabled>
								Vælg karakter
							</option>
							{["-3", "00", "02", "4", "7", "10", "12"].map((g) => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
					</div>
				)}
			</div>
		</div>
	);
};

export default StartEksamenPage;
