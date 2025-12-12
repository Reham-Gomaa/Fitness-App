export interface LevelsResponse {
    message: string;
    totalLevels: number;
    difficulty_levels: DifficultyLevel[];
}

export interface DifficultyLevel {
    id: string;
    name: string;
}
