export interface DashboardTask {
	id: string;

	text: string;
	completed: boolean;

	/**
	 * Original Obsidian task status.
	 * ' ' means incomplete, any other character means completed.
	 */
	status: string;

	filePath: string;
	line: number;
}

export interface DailyTasks {
	date: string;
	filePath: string;
	tasks: DashboardTask[];
}
