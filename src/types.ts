export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  overlayData?: {
    expertise?: string;
    completed?: string;
    materials?: string;
    datum?: string;
    level?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  summary: string;
  details: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  projectVision: string;
  submittedAt: string;
  status: "Pending Review" | "Under Simulation" | "Consultation Scheduled";
  estimatedCompletion: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating?: number;
}
