import { RoutePlaceholder } from "../../components/common";

/**
 * Departments management page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const DepartmentsPage = () => {
  return (
    <RoutePlaceholder
      title="Departments"
      description="Manage organizational departments and teams."
      routePath="/dashboard/departments"
    />
  );
};

export default DepartmentsPage;
