import { Baby, Brain, Eye, HeartPulse, Smile, Stethoscope, type LucideIcon } from "lucide-react";

export const specialtyIconMap: Record<string, LucideIcon> = {
  Stethoscope,
  HeartPulse,
  Smile,
  Eye,
  Brain,
  Baby,
};

export function getSpecialtyIcon(icon: string): LucideIcon {
  return specialtyIconMap[icon] ?? Stethoscope;
}
