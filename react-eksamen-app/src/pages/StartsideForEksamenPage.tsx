import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Exam } from "../interface/Exam";
import { fetchAllData } from "../api/examApi";
import styles from "../styles/StartsideForEksamenPage.module.css";

const StartsideForEksamenPage = () => {
	const [exams, setExams] = useState<Exam[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const loadExams = async () => {
			setIsLoading(true);
			const { exams } = await fetchAllData();
			setExams(exams);
			setIsLoading(false);
		};
		loadExams();
	}, []);

	if (isLoading) {
		return <div>Indlæser eksamener...</div>;
	}

	return (
		<div className={styles.container}>
			<h1>Start en Eksamen</h1>
			<p>Vælg en eksamen fra listen nedenfor for at begynde eksaminationen.</p>

			{exams.length > 0 ? (
				<ul className={styles.examList}>
					{exams.map((exam) => (
						<li key={exam.id} className={styles.examItem}>
							<div className={styles.examDetails}>
								<strong>{exam.courseName}</strong>
								<span>
									{exam.examtermin} - {new Date(exam.date).toLocaleDateString()}
								</span>
							</div>
							<Link to={`/eksamen/${exam.id}`} className={styles.startButton}>
								Start Eksamen
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p>
					Der er ingen oprettede eksamener.{" "}
					<Link to="/opret-eksamen">Opret en ny eksamen</Link> for at komme i
					gang.
				</p>
			)}
		</div>
	);
};

export default StartsideForEksamenPage;
