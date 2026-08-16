import { App, TFile } from 'obsidian';
import InteractiveDashboardPlugin from '../main';
import { DashboardTask } from '../types/dashboard';

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

	async getTasks(date: Date): Promise<DashboardTask[]> {
		const file = this.getDailyNote(date);

		if (!file) {
			return [];
		}

		const cache = this.app.metadataCache.getFileCache(file);

		if (!cache?.listItems) {
			return [];
		}

		const content = await this.app.vault.read(file);
		const lines = content.split('\n');

		return cache.listItems
			.filter((item) => item.task !== undefined)
			.map((item) => {
				const line = item.position.start.line;
				const rawLine = lines[line] ?? '';
				const status = item.task ?? ' ';

				return {
					id: `${file.path}:${line}`,
					text: this.extractTaskText(rawLine),
					completed: status !== ' ',
					status,
					filePath: file.path,
					line: line,
				};
			});
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
