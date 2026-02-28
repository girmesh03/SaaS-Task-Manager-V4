import { RoutePlaceholder } from "../../components/common";

/**
 * Tasks management page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const TasksPage = () => {
  return (
    <RoutePlaceholder
      title="Tasks"
      description="View, create, and manage project tasks and assignments."
      routePath="/dashboard/tasks"
    />
  );
};

export default TasksPage;
