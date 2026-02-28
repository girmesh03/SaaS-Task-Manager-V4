import { RoutePlaceholder } from "../../components/common";

/**
 * Task details page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const TaskDetailsPage = () => {
  return (
    <RoutePlaceholder
      title="Task Details"
      description="View and manage task information, activities, and comments."
      routePath="/dashboard/tasks/:taskId"
    />
  );
};

export default TaskDetailsPage;
