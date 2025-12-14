export type DifficultyLevel = "Débutant" | "Intermédiaire" | "Avancé";

export interface Project {
  id: number;
  title: string;
  concepts: string[];
  difficulty: DifficultyLevel;
  color: string;
  icon: string;
  component?: string;
}

export interface ProjectComponentProps {
  onBack: () => void;
}