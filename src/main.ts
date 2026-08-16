import { Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	InteractiveDashboardPluginSettings,
	InteractiveDashboardSettingTab,
} from './settings';
import { DashboardView, VIEW_TYPE_DASHBOARD } from './views/DashboardView';
import { DailyNoteService } from './services/DailyNotesService';

export default class InteractiveDashboardPlugin extends Plugin {
	settings!: InteractiveDashboardPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon('file-chart-pie', 'Dashboard', () => {
			void this.activateDashboardView();
		});

		this.registerView(
			VIEW_TYPE_DASHBOARD,
			(leaf) => new DashboardView(leaf, this),
		);

		this.addCommand({
			id: 'open-dashboard',
			name: 'Open dashboard',
			callback: () => {
				void this.activateDashboardView();
			},
		});

		this.addSettingTab(new InteractiveDashboardSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<InteractiveDashboardPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateDashboardView() {
		const { workspace } = this.app;

		let leaf = workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD)[0];

		if (!leaf) {
			leaf = workspace.getLeaf('tab');

			await leaf.setViewState({
				type: VIEW_TYPE_DASHBOARD,
				active: true,
			});
		}

		await workspace.revealLeaf(leaf);
	}
}
