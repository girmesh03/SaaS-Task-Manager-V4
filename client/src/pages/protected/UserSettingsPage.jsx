import { RoutePlaceholder } from "../../components/common";

/**
 * User settings page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const UserSettingsPage = () => {
  return (
    <RoutePlaceholder
      title="User Settings"
      description="Manage personal profile, preferences, and account settings."
      routePath="/dashboard/users/:userId/settings"
    />
  );
};

export default UserSettingsPage;
