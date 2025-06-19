import { Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.css";
import HistorikPage from "./pages/HistorikPage";
import StartEksamenPage from "./pages/StartEksamenPage";
import OpretEksamenPage from "./pages/OpretEksamenPage";
import StartsideForEksamenPage from "./pages/StartsideForEksamenPage";
import TilfojStuderendePage from "./pages/TilfojStuderendePage";

const HomePage = () => <h1>Velkommen til Eksamensystemet</h1>;

function App() {
	return (
		<div className={styles.appContainer}>
			<header className={styles.header}>
				<div className={styles.navContainer}>
					<nav className={styles.nav}>
						<Link to="/" className={styles.navLink}>
							Hjem
						</Link>
						<Link to="/opret-eksamen" className={styles.navLink}>
							Opret Eksamen
						</Link>
						<Link to="/tilfoj-studerende" className={styles.navLink}>
							Tilføj Studerende
						</Link>
						<Link to="/start-eksamen" className={styles.navLink}>
							Start Eksamen
						</Link>
						<Link to="/historik" className={styles.navLink}>
							Se Historik
						</Link>
					</nav>
				</div>
			</header>

			<main className={styles.mainContent}>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/opret-eksamen" element={<OpretEksamenPage />} />
					<Route path="/tilfoj-studerende" element={<TilfojStuderendePage />} />
					<Route path="/start-eksamen" element={<StartsideForEksamenPage />} />
					<Route path="/eksamen/:examId" element={<StartEksamenPage />} />
					<Route path="/historik" element={<HistorikPage />} />
				</Routes>
			</main>
		</div>
	);
}

export default App;
