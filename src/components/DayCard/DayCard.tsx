interface DayCardProps {
	date: string;
	tasks: string[];
}

const DayCard = ({ date, tasks }: DayCardProps) => {
	return (
		<div className="day-card">
			<div className="day-card__header">
				<h2>{date}</h2>
			</div>

			<div className="day-card__tasks">
				{tasks.map((task) => (
					<div className="day-card__task" key={task}>
						<input type="checkbox" disabled />

						<span>{task}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default DayCard;
