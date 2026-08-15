import DayCard from '../DayCard/DayCard';

const mockDays = [
	{
		date: '15 August',
		tasks: ['Learn Obsidian API', 'Work on dashboard'],
	},
	{
		date: '16 August',
		tasks: ['Read documentation', 'Implement tasks'],
	},
	{
		date: '17 August',
		tasks: ['Work on frontend'],
	},
];
const Dashboard = () => {
	return (
		<div className="dashboard">
			<div className="dashboard__days">
				{mockDays.map((day) => (
					<DayCard key={day.date} date={day.date} tasks={day.tasks} />
				))}
			</div>
		</div>
	);
};

export default Dashboard;
