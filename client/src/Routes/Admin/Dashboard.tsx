import Navigation from './Navigation.tsx';
import TopBar     from './TopBar.tsx';
import Copyright  from './Copyright.tsx';
import './Dashboard.scss'

export default function Dashboard({className})
{
	return (
		<div className={`dashboard`}>
			<TopBar />
			<div className="main-dashboard">

				<div className="topic">

					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>
					<div className="topic-items"></div>

				</div>
				<div className="bottom-topic">
					<div className="big-diagram"></div>					
					<div className="transactions"></div>
				</div>
			</div>
			<Copyright />
		</div>
	);
}
