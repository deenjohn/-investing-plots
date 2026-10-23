import { SixPercentDetails } from "@/components/ProjectDetails";
import { ProjectLanding, projectMetadata } from "@/components/ProjectLanding";
import { findEnquiry, type ProjectPage } from "@/lib/projects";

const project = findEnquiry("six") as ProjectPage;

export const metadata = projectMetadata(project);

export default function SixPercentPlotsPage() {
  return (
    <ProjectLanding project={project}>
      <SixPercentDetails />
    </ProjectLanding>
  );
}
