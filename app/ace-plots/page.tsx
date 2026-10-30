import { AceDetails } from "@/components/ProjectDetails";
import { ProjectLanding, projectMetadata } from "@/components/ProjectLanding";
import { findEnquiry, type ProjectPage } from "@/lib/projects";

const project = findEnquiry("ace") as ProjectPage;

export const metadata = projectMetadata(project);

export default function AcePlotsPage() {
  return (
    <ProjectLanding project={project}>
      <AceDetails />
    </ProjectLanding>
  );
}
