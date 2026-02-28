import { RoutePlaceholder } from "../../components/common";

/**
 * Department details page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const DepartmentDetailsPage = () => {
  return (
    <RoutePlaceholder
      title="Department Details"
      description="View and manage department information, members, and tasks."
      routePath="/dashboard/departments/:departmentId"
    />
  );
};

export default DepartmentDetailsPage;
