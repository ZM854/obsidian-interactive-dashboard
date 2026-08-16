import { TFile, Vault } from 'obsidian';
import { DailyNoteService } from '../../services/DailyNotesService';
import DayCard from '../DayCard/DayCard';
import { useCallback, useEffect, useState } from 'react';
import { DailyTasks } from '../../types/dashboard';

interface DashboardProps {
	dailyNotesService: DailyNoteService;
	vault: Vault;
}

const DAYS_TO_SHOW = 7;

const getNextDays = (count: number): Date[] => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return Array.from({ length: count }, (_, index) => {
		const date = new Date(today);
		date.setDate(today.getDate() + index);

		return date;
	});
};

const Dashboard = ({ dailyNotesService, vault }: DashboardProps) => {
	const [days, setDays] = useState<DailyTasks[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadTasks = useCallback(async () => {
		try {
			setError(null);

			const dates = getNextDays(DAYS_TO_SHOW);
			const result = await dailyNotesService.getTasksForDays(dates);

			setDays(result);
		} catch (error) {
			console.error('Failed to load dashboard tasks:', error);

			setError('Не удалось загрузить задачи');
		} finally {
			setLoading(false);
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
			await dailyNotesService.setTaskCompleted(task, completed);
		} catch (error) {
			console.error('failed to update task:', error);

			await loadTasks();
		}
	};

	const handleDayClick = async (date: Date) => {
		const opened = await dailyNotesService.openDailyNote(date);

		if (!opened) {
			console.log('Daily note does not exist');
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	return (
		<div className="dashboard">
			<div className="dashboard__days">
				{days.map((day) => (
					<DayCard
						key={day.date.toISOString()}
						date={day.date}
						tasks={day.tasks}
						onTaskChange={handleTaskChange}
						onDayClick={handleDayClick}
					/>
				))}
			</div>
		</div>
	);
};

export default Dashboard;
