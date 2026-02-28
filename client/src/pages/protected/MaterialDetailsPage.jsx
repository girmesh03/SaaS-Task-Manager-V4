import { RoutePlaceholder } from "../../components/common";

/**
 * Material details page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const MaterialDetailsPage = () => {
  return (
    <RoutePlaceholder
      title="Material Details"
      description="View and manage material information, stock, and vendor details."
      routePath="/dashboard/materials/:materialId"
    />
  );
};

export default MaterialDetailsPage;
