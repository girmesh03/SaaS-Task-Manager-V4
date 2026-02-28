import { RoutePlaceholder } from "../../components/common";

/**
 * Vendor details page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const VendorDetailsPage = () => {
  return (
    <RoutePlaceholder
      title="Vendor Details"
      description="View and manage vendor information, materials, and contact history."
      routePath="/dashboard/vendors/:vendorId"
    />
  );
};

export default VendorDetailsPage;
