import { App, TFile } from 'obsidian';
import InteractiveDashboardPlugin from '../main';
import { DailyTasks, DashboardTask } from '../types/dashboard';

export class DailyNoteService {
	constructor(
		private app: App,
		private plugin: InteractiveDashboardPlugin,
	) {}

	getDailyNotePath(date: Date) {
		const folder = this.plugin.settings.dailyNotesFolder
			.trim()
			.replace(/^\/+|\/+$/g, '');

		return `${folder}/${this.formatDailyNoteName(date)}`;
	}

	getDailyNote(date: Date): TFile | null {
		const path = this.getDailyNotePath(date);
		const file = this.app.vault.getAbstractFileByPath(path);

		return file instanceof TFile ? file : null;
	}

	isDailyNote(file: TFile): boolean {
		const folder = this.plugin.settings.dailyNotesFolder
			.trim()
			.replace(/^\/+|\/+$/g, '');

		return file.path.startsWith(`${folder}/`);
	}

	async getTasks(date: Date): Promise<DashboardTask[]> {
		const file = this.getDailyNote(date);

		if (!file) {
			return [];
		}

		const content = await this.app.vault.read(file);
		const lines = content.split('\n');

		return lines.flatMap((rawLine, line) => {
			const status = this.getTaskStatus(rawLine);
			const text = this.extractTaskText(rawLine);

			if (status === null || text.length === 0) {
				return [];
			}

			return [{
				id: `${file.path}:${line}`,
				text,
				completed: status !== ' ',
				status,
				filePath: file.path,
				line,
			}];
		});
	}

	async getTasksForDays(dates: Date[]): Promise<DailyTasks[]> {
		return Promise.all(
			dates.map(async (date) => ({
				date,
				filePath: this.getDailyNotePath(date),
				tasks: await this.getTasks(date),
			})),
		);
	}

	async setTaskCompleted(
		task: DashboardTask,
		completed: boolean,
	): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(task.filePath);

		if (!(file instanceof TFile)) {
			throw new Error(`Daily note not found: ${task.filePath}`);
		}

		await this.app.vault.process(file, (content) => {
			const lines = content.split('\n');
			const currentLine = lines[task.line];

			if (currentLine === undefined) {
				throw new Error(`Task line was not found: ${task.line}`);
			}

			const currentStatus = this.getTaskStatus(currentLine);

			if (currentStatus === null) {
				throw new Error(
					`Task not found at ${task.filePath}:${task.line}`,
				);
			}

			if (!this.isSameTask(currentLine, task)) {
				throw new Error(
					`Task has changed or moved: ${task.filePath}:${task.line}`,
				);
			}

			lines[task.line] = this.replaceTaskStatus(currentLine, completed);
			return lines.join('\n');
		});
	}

	async openDailyNote(date: Date): Promise<boolean> {
		const file = this.getDailyNote(date);

		if (!file) {
			return false;
		}

		await this.app.workspace.getLeaf().openFile(file);

		return true;
	}

	private isSameTask(line: string, task: DashboardTask): boolean {
		return this.extractTaskText(line) === task.text;
	}

	private getTaskStatus(line: string): string | null {
		const match = line.match(/^\s*[-*+]\s+\[([^\]])\]/);

		return match?.[1] ?? null;
	}

	private replaceTaskStatus(line: string, completed: boolean): string {
		return line.replace(
			/^(\s*[-*+]\s+\[)[^\]](\])/,
			`$1${completed ? 'x' : ' '}$2`,
		);
	}

	private extractTaskText(line: string): string {
		return line.replace(/^\s*[-*+]\s+\[[^\]]\]\s*/, '').trim();
	}

	private formatDailyNoteName(date: Date): string {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();

		return `${day}-${month}-${year}.md`;
	}
}
