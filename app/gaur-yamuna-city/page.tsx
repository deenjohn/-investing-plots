import { GaurYamunaDetails } from "@/components/ProjectDetails";
import { ProjectLanding, projectMetadata } from "@/components/ProjectLanding";
import { findEnquiry, type ProjectPage } from "@/lib/projects";

const project = findEnquiry("gaur") as ProjectPage;

export const metadata = projectMetadata(project);

export default function GaurYamunaCityPage() {
  return (
    <ProjectLanding project={project}>
      <GaurYamunaDetails />
    </ProjectLanding>
  );
}
