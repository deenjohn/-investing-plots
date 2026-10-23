import { ProjectLanding, projectMetadata } from "@/components/ProjectLanding";
import { findEnquiry, type ProjectPage } from "@/lib/projects";

const project = findEnquiry("webcity") as ProjectPage;

export const metadata = projectMetadata(project);

export default function WebcityPlotsPage() {
  return <ProjectLanding project={project} />;
}
