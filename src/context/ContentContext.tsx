import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { SiteContent } from "@/types/content";
import { initialContent } from "@/data/initialContent";

interface ContentContextType {
  content: SiteContent;
  updateContent: <K extends keyof SiteContent>(
    section: K,
    data: Partial<SiteContent[K]>
  ) => void;
  updateNestedContent: <K extends keyof SiteContent, N extends keyof SiteContent[K]>(
    section: K,
    nestedKey: N,
    data: Partial<SiteContent[K][N]>
  ) => void;
  resetContent: () => void;
  saveContent: () => void;
  isDirty: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = "sweethome_admin_content";

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialContent;
  });
  const [isDirty, setIsDirty] = useState(false);

  const updateContent = useCallback(<K extends keyof SiteContent>(
    section: K,
    data: Partial<SiteContent[K]>
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
    setIsDirty(true);
  }, []);

  const updateNestedContent = useCallback(<K extends keyof SiteContent, N extends keyof SiteContent[K]>(
    section: K,
    nestedKey: N,
    data: Partial<SiteContent[K][N]>
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: { ...(prev[section] as any)[nestedKey], ...data },
      },
    }));
    setIsDirty(true);
  }, []);

  const saveContent = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    setIsDirty(false);
  }, [content]);

  const resetContent = useCallback(() => {
    setContent(initialContent);
    localStorage.removeItem(STORAGE_KEY);
    setIsDirty(false);
  }, []);

  return (
    <ContentContext.Provider
      value={{ content, updateContent, updateNestedContent, resetContent, saveContent, isDirty }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};
