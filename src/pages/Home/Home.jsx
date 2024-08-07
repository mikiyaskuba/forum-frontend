import "./Home.css";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Home = () => {
	const { user } = useAuth();
	const [questions, setQuestions] = useState([]);

	useEffect(() => {
		const fetchQuestions = async () => {
			try {
				const response = await axios.get(
					"https://forum-backend-1-c5of.onrender.com/api/questions/questions"
				);
				setQuestions(response.data.questions);
			} catch (error) {
				console.error("Error fetching questions:", error);
			}
		};

		fetchQuestions();
	}, []);

	const handleDelete = async (questionId) => {
		try {
			await axios.delete(
				`https://forum-backend-1-c5of.onrender.com/api/questions/questions/${questionId}`,
				{
					headers: {
						Authorization: `Bearer ${user.token}`, // Assuming the token is stored in user.token
					},
				}
			);
			setQuestions(
				questions.filter((question) => question.questionid !== questionId)
			);
		} catch (error) {
			console.error("Error deleting question:", error);
		}
	};

	return (
		<div className="home-container">
			<header className="home-header">
				<button className="ask-question-btn">
					<Link className="link" to={"/askquestion"}>
						Ask Question
					</Link>
				</button>
				<div className="welcome-message">
					Welcome: {user ? user.email.split("@")[0] : "Guest"}
				</div>
			</header>

			<section className="questions-section">
				<h2>Questions</h2>
				<ul className="questions-list">
					{questions.map((question) => (
						<li key={question.questionid} className="question-item">
							<Link
								to={`/question/${question.questionid}`}
								className="question-link"
							>
								<div className="question-content">
									<div className="question-user">
										<div className="avatar">
											<FontAwesomeIcon className="icon" icon={faUserTie} />
										</div>
										<span>{question.username} :- </span>
									</div>
									<div className="question-text">{question.description}</div>
								</div>
							</Link>
							<div>
								
							</div>
							{user && user.email === question.email && (
								<button
									className="delete-btn"
									onClick={() => handleDelete(question.questionid)}
								>
									Delete
								</button>
							)}
						</li>
					))}
				</ul>
			</section>
		</div>
	);
};

export default Home;
