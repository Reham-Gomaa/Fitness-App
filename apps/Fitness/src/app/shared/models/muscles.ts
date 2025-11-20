export interface musclesRes {
  message: string;
  musclesGroup: MuscleGroup[];
}


export interface muscleGroupRes {
  message: string;
  muscleGroup?: MuscleGroup;
  totalMuscles?:number,
  muscles: Muscle[];
}


export interface Muscle {
  _id: string;
  name: string;
  image: string;
}

export interface MuscleGroup {
  _id: string;
  name: string;
  isActive?:boolean
}
