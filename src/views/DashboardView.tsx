import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import Dashboard from '../components/Dashboard/Dashboard';
import InteractiveDashboardPlugin from '../main';

export const VIEW_TYPE_DASHBOARD = 'dashboard';

export class DashboardView extends ItemView {
	private root: Root | null = null;

	constructor(
		leaf: WorkspaceLeaf,
		private plugin: InteractiveDashboardPlugin,
	) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE_DASHBOARD;
	}

	getDisplayText(): string {
		return 'Dashboard';
	}

	protected async onOpen(): Promise<void> {
		this.root = createRoot(this.contentEl);
		this.root.render(
			<StrictMode>
				<Dashboard
					daysToDisplay={this.plugin.settings.daysToDisplay}
					dailyNotesService={this.plugin.dailyNotesService}
					vault={this.app.vault}
				/>
			</StrictMode>,
		);
	}
	protected async onClose(): Promise<void> {
		this.root?.unmount();
	}
}
