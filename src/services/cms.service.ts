import { config } from '@/config/env';

const API_BASE = `${config.apiBaseUrl}/cms`;

interface CMSPage {
  html?: string;
  content?: string;
  [key: string]: any;
}

interface CMSSnapshot {
  id: number;
  at: number;
  data: CMSPage;
}

export const cmsService = {
  // Public endpoints
  async getPage(page: string): Promise<CMSPage | null> {
    try {
      const response = await fetch(`${API_BASE}/${page}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.page;
    } catch (err) {
      console.error(`Failed to load ${page}:`, err);
      return null;
    }
  },

  // Admin endpoints
  async savePage(page: string, content: CMSPage): Promise<CMSSnapshot | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/admin/cms/${page}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.snapshot;
    } catch (err) {
      console.error(`Failed to save ${page}:`, err);
      return null;
    }
  },

  async getHistory(page: string): Promise<CMSSnapshot[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/admin/cms/${page}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.history || [];
    } catch (err) {
      console.error(`Failed to load history for ${page}:`, err);
      return [];
    }
  },

  async restoreSnapshot(page: string, snapshotId: number): Promise<CMSPage | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiBaseUrl}/admin/cms/${page}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: snapshotId })
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.page;
    } catch (err) {
      console.error(`Failed to restore snapshot for ${page}:`, err);
      return null;
    }
  }
};

export default cmsService;
