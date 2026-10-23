import { ProjectLanding, projectMetadata } from "@/components/ProjectLanding";
import { findEnquiry, type ProjectPage } from "@/lib/projects";

const project = findEnquiry("lodha") as ProjectPage;

export const metadata = projectMetadata(project);

export default function LodhaPlotsPage() {
  return <ProjectLanding project={project} />;
}
