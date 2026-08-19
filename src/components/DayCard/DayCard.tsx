import { DashboardTask } from '../../types/dashboard';
import {
	card,
	checkbox,
	completed,
	empty,
	header,
	task as taskClassName,
	tasks as tasksClassName,
	taskText,
} from './DayCard.module.css';

interface DayCardProps {
	date: Date;
	tasks: DashboardTask[];
	onTaskChange: (taskId: string, completed: boolean) => void;
	onDayClick: (date: Date) => void;
}

const DayCard = ({ date, tasks, onTaskChange, onDayClick }: DayCardProps) => {
	return (
		<div className={card}>
			<h3 className={header} onClick={() => onDayClick(date)}>
				{date.toLocaleDateString('en-US', {
					day: 'numeric',
					month: 'long',
				})}
			</h3>

			<div className={tasksClassName}>
				{tasks.length === 0 ? (
					<p className={empty}>No tasks</p>
				) : (
					tasks.map((task) => (
						<label
							className={`${taskClassName} ${task.completed ? completed : ''}`}
							key={task.id}
						>
							<input
								className={checkbox}
								type="checkbox"
								checked={task.completed}
								onChange={(event) => {
									void onTaskChange(
										task.id,
										event.target.checked,
									);
								}}
							/>

							<span className={taskText}>{task.text}</span>
						</label>
					))
				)}
			</div>
		</div>
	);
};

export default DayCard;
