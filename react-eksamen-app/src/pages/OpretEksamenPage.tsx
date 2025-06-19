import React, { useState } from "react";
import type { Exam } from "../interface/Exam";
import styles from "../styles/OpretEksamensPage.module.css";
import { useNavigate } from "react-router-dom";
import { saveExam } from "../api/examApi"; // NY IMPORT

// Vi definerer en starttilstand for vores formular
const initialState: Omit<Exam, "id"> = {
	examtermin: "",
	courseName: "",
	date: "",
	numberOfQuestions: 10,
	examDurationMinutes: 15,
	startTime: "09:00",
};

const OpretEksamenPage = () => {
	const [formData, setFormData] = useState(initialState);
	const navigate = useNavigate();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;
		const processedValue = type === "number" ? parseInt(value, 10) || 0 : value;
		setFormData((prevData) => ({
			...prevData,
			[name]: processedValue,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.courseName || !formData.examtermin || !formData.date) {
			alert("Udfyld venligst alle påkrævede felter.");
			return;
		}

		try {
			// Kald API'et for at gemme den nye eksamen
			const newExam = await saveExam(formData);
			console.log("Ny eksamen oprettet:", newExam);
			alert(`Eksamen '${newExam.courseName}' er oprettet!`);

			// Send brugeren videre for at tilføje studerende
			navigate("/tilfoj-studerende");
		} catch (error) {
			console.error("Failed to save exam:", error);
			alert("Der skete en fejl under oprettelsen af eksamen.");
		}
	};

	return (
		<div className={styles.container}>
			<h1>Opret Ny Eksamen</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				{/* ... resten af din JSX form er uændret ... */}
				<div className={styles.formGroup}>
					<label htmlFor="courseName">Kursusnavn</label>
					<input
						type="text"
						id="courseName"
						name="courseName"
						value={formData.courseName}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="examtermin">
						Eksamenstermin (f.eks. "sommer 25")
					</label>
					<input
						type="text"
						id="examtermin"
						name="examtermin"
						value={formData.examtermin}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="date">Dato</label>
					<input
						type="date"
						id="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
						required
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="startTime">Starttidspunkt</label>
					<input
						type="time"
						id="startTime"
						name="startTime"
						value={formData.startTime}
						onChange={handleChange}
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="numberOfQuestions">Antal Spørgsmål</label>
					<input
						type="number"
						id="numberOfQuestions"
						name="numberOfQuestions"
						value={formData.numberOfQuestions}
						onChange={handleChange}
						min="1"
					/>
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="examDurationMinutes">Eksamenstid (minutter)</label>
					<input
						type="number"
						id="examDurationMinutes"
						name="examDurationMinutes"
						value={formData.examDurationMinutes}
						onChange={handleChange}
						min="5"
					/>
				</div>

				<button type="submit" className={styles.submitButton}>
					Opret Eksamen
				</button>
			</form>
		</div>
	);
};

export default OpretEksamenPage;
