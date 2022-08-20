import { gql } from "@apollo/client";
import React, { useContext, useState } from "react";
import CommitSelector from "../../Components/CommitSelector";
import ResourceSelector from "../../Components/ResourceSelector";
import { AppContext } from "../../context/appContext";
import { Commit, Resource } from "../../models";
import "./CodeViewBar.scss";
import CodeViewExplorerTree from "./CodeViewExplorerTree";
import { FileDetails } from "./CodeViewPage";
import { NodeTypeEnum } from "./NodeTypeEnum";
import useCommit from "../../VersionControl/hooks/useCommits";

const CLASS_NAME = "code-view-bar";

type Props = {
  onFileSelected: (selectedFile: FileDetails | null) => void;
};

export type FileMeta = {
  type: NodeTypeEnum;
  name: string;
  path: string;
  children?: FileMeta[] | undefined;
  expanded?: boolean;
};

const CodeViewExplorer: React.FC<Props> = ({ onFileSelected }) => {
  const { resources } = useContext(AppContext);
  const { commits } = useCommit();

  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(
    commits[0]
  );
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    resources[0]
  );

  const handleSelectedCommit = (commit: Commit) => {
    setSelectedCommit(commit);
    onFileSelected(null);
  };

  const handleSelectedResource = (resource: Resource) => {
    setSelectedResource(resource);
  };

  return (
    <div className={CLASS_NAME}>
      <div>
        <CommitSelector
          commits={commits}
          selectedCommit={selectedCommit}
          onSelectCommit={handleSelectedCommit}
        />
        <ResourceSelector
          resources={resources}
          selectedResource={selectedResource}
          onSelectResource={handleSelectedResource}
        />
      </div>
      {selectedCommit && selectedResource && selectedCommit.builds && (
        <CodeViewExplorerTree
          selectedBuild={selectedCommit?.builds[0]}
          resourceId={selectedResource.id}
          onFileSelected={onFileSelected}
        />
      )}
    </div>
  );
};

export default CodeViewExplorer;

export const GET_BUILDS_COMMIT = gql`
  query builds(
    $resourceId: String!
    $orderBy: BuildOrderByInput
    $whereMessage: StringFilter
  ) {
    builds(
      where: { resource: { id: $resourceId }, message: $whereMessage }
      orderBy: $orderBy
    ) {
      id
      message
      createdAt
      resourceId
    }
  }
`;
