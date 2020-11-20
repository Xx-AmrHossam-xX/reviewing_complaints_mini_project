import './App.css';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import Axios from './Axios';
import { useState, useEffect } from 'react';

function App (){
	//
	const [ QuestionTwoChoices, SetQuestionTwoChoices ] = useState();
	const [ QuestionFourChoices, SetQuestionFourChoices ] = useState();
	//
	const [ QuestTwoGood, SetQuestTwoGood ] = useState();
	const [ QuestTwoNeutral, SetQuestTwoNeutral ] = useState();
	const [ QuestTwoBad, SetQuestTwoBad ] = useState();
	//
	const [ QuestFourGood, SetQuestFourGood ] = useState();
	const [ QuestFourNeutral, SetQuestFourNeutral ] = useState();
	const [ QuestFourBad, SetQuestFourBad ] = useState();
	//
	const [ FromDate, SetFromDate ] = useState(new Date());
	const [ ToDate, SetToDate ] = useState(new Date());

	useEffect(() => {
		Axios.get('/questions').then(res => {
			console.log(res.data.en, 'res');
			SetQuestionTwoChoices(res.data.en.find(item => item.id === 2));
			SetQuestionFourChoices(res.data.en.find(item => item.id === 4));
		});
	}, []);
	useEffect(
		() => {
			if (QuestionTwoChoices) {
				QuestionTwoChoices.choices.map(item => {
					switch (item.text) {
						case 'Good':
							SetQuestTwoGood(item.id);
							break;
						case 'Neutral':
							SetQuestTwoNeutral(item.id);
							break;
						case 'Bad':
							SetQuestTwoBad(item.id);
							break;
						default:
							break;
					}
				});
			}
		},
		[ QuestionTwoChoices ]
	);
	useEffect(
		() => {
			if (QuestionFourChoices) {
				QuestionFourChoices.choices.map(item => {
					switch (item.text) {
						case 'Good':
							SetQuestFourGood(item.id);
							break;
						case 'Neutral':
							SetQuestFourNeutral(item.id);
							break;
						case 'Bad':
							SetQuestFourBad(item.id);
							break;
						default:
							break;
					}
				});
			}
		},
		[ QuestionFourChoices ]
	);
	var today = new Date();
	var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
	//

	return (
		<div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
			<div>
				<h3>From :</h3>
				<InfiniteCalendar
					width={300}
					height={300}
					selected={FromDate}
					// disabledDays={[ 0, 6 ]}
					// minDate={lastWeek}
					onSelect={function (date){
						SetFromDate(date);
					}}
					maxDate={ToDate}
					max={today}
				/>
			</div>
			<div style={{ border: '5px solid black', width: 400, height: 400 }} />
			<div>
				<h3>To :</h3>
				<InfiniteCalendar
					width={300}
					height={300}
					selected={ToDate}
					// disabledDays={[ 0, 6 ]}
					minDate={FromDate}
					onSelect={function (date){
						SetToDate(date);
					}}
					maxDate={today}
					max={today}
				/>
			</div>
		</div>
	);
}

export default App;
