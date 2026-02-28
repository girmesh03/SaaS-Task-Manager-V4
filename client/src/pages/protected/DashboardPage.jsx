import { RoutePlaceholder } from "../../components/common";

/**
 * Organizational dashboard overview page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const DashboardPage = () => {
  return (
    <RoutePlaceholder
      title="Dashboard"
      description="Analytics dashboard placeholder."
      routePath="/dashboard"
    />
  );
};

export default DashboardPage;
