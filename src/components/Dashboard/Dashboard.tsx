import { TFile, Vault } from 'obsidian';
import { DailyNoteService } from '../../services/DailyNotesService';
import DayCard from '../DayCard/DayCard';
import {
	dashboard,
	days as daysClassName,
	sectionTitle,
} from './Dashboard.module.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DailyTasks } from '../../types/dashboard';

interface DashboardProps {
	dailyNotesService: DailyNoteService;
	vault: Vault;
	daysToDisplay: number;
}

const getNextDays = (count: number): Date[] => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return Array.from({ length: count }, (_, index) => {
		const date = new Date(today);
		date.setDate(today.getDate() + index);

		return date;
	});
};

const Dashboard = ({
	dailyNotesService,
	vault,
	daysToDisplay,
}: DashboardProps) => {
	const [days, setDays] = useState<DailyTasks[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const loadVersion = useRef(0);

	const loadTasks = useCallback(async () => {
		const version = ++loadVersion.current;

		try {
			setError(null);

			const dates = getNextDays(daysToDisplay);
			const result = await dailyNotesService.getTasksForDays(dates);

			if (version === loadVersion.current) {
				setDays(result);
			}
		} catch (error) {
			console.error('Failed to load dashboard tasks:', error);

			if (version === loadVersion.current) {
				setError('Failed to load tasks');
			}
		} finally {
			if (version === loadVersion.current) {
				setLoading(false);
			}
		}
	}, [dailyNotesService]);

	useEffect(() => {
		void loadTasks();
	}, [loadTasks]);

	useEffect(() => {
		const event = vault.on('modify', (file) => {
			if (!(file instanceof TFile)) {
				return;
			}

			if (!dailyNotesService.isDailyNote(file)) {
				return;
			}

			void loadTasks();
		});

		return () => {
			vault.offref(event);
		};
	}, [vault, dailyNotesService, loadTasks]);

	const handleTaskChange = async (taskId: string, completed: boolean) => {
		const task = days
			.flatMap((day) => day.tasks)
			.find((task) => task.id === taskId);

		if (!task) {
			return;
		}

		try {
			loadVersion.current += 1;
			setDays((currentDays) =>
				currentDays.map((day) => ({
					...day,
					tasks: day.tasks.map((currentTask) =>
						currentTask.id === taskId
							? {
									...currentTask,
									completed,
									status: completed ? 'x' : ' ',
								}
							: currentTask,
					),
				})),
			);

			await dailyNotesService.setTaskCompleted(task, completed);
			await loadTasks();
		} catch (error) {
			console.error('failed to update task:', error);

			await loadTasks();
		}
	};

	const handleDayClick = async (date: Date) => {
		await dailyNotesService.openDailyNote(date);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<section className={dashboard} aria-labelledby="dashboard-tasks-title">
			<h2 className={sectionTitle} id="dashboard-tasks-title">
				{`Tasks for the next ${daysToDisplay} ${daysToDisplay === 1 ? 'day' : 'days'}`}
			</h2>
			<div className={daysClassName}>
				{days.map((day) => (
					<DayCard
						key={day.date.toISOString()}
						date={day.date}
						tasks={day.tasks}
						onTaskChange={(taskId, completed) => {
							void handleTaskChange(taskId, completed);
						}}
						onDayClick={(date) => {
							void handleDayClick(date);
						}}
					/>
				))}
			</div>
		</section>
	);
};

export default Dashboard;
