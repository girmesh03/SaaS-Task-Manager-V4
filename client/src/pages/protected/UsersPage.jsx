import { RoutePlaceholder } from "../../components/common";

/**
 * Users management page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const UsersPage = () => {
  return (
    <RoutePlaceholder
      title="Users"
      description="Manage team members, roles, and user permissions."
      routePath="/dashboard/users"
    />
  );
};

export default UsersPage;
