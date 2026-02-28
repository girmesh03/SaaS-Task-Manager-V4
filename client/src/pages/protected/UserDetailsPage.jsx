import { RoutePlaceholder } from "../../components/common";

/**
 * User details page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const UserDetailsPage = () => {
  return (
    <RoutePlaceholder
      title="User Details"
      description="View and manage user profile, tasks, and performance metrics."
      routePath="/dashboard/users/:userId"
    />
  );
};

export default UserDetailsPage;
