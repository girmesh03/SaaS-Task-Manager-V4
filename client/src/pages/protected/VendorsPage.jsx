import { RoutePlaceholder } from "../../components/common";

/**
 * Vendors management page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const VendorsPage = () => {
  return (
    <RoutePlaceholder
      title="Vendors"
      description="Manage vendor relationships, contacts, and procurement."
      routePath="/dashboard/vendors"
    />
  );
};

export default VendorsPage;
