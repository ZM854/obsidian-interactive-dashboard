import { DashboardTask } from '../../types/dashboard';

interface DayCardProps {
	date: Date;
	tasks: DashboardTask[];
	onTaskChange: (taskId: string, completed: boolean) => void;
	onDayClick: (date: Date) => void;
}

const DayCard = ({ date, tasks, onTaskChange, onDayClick }: DayCardProps) => {
	return (
		<div className="day-card">
			<div className="day-card__header">
				<button type="button" onClick={() => onDayClick(date)}>
					{date.toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'long',
					})}
				</button>
			</div>

			<div className="day-card__tasks">
				{tasks.length === 0 ? (
					<p>No tasks</p>
				) : (
					tasks.map((task) => (
						<label className="day-card__task" key={task.id}>
							<input
								type="checkbox"
								checked={task.completed}
								onChange={(event) => {
									void onTaskChange(
										task.id,
										event.target.checked,
									);
								}}
							/>

							<span>{task.text}</span>
						</label>
					))
				)}
			</div>
		</div>
	);
};

export default DayCard;
