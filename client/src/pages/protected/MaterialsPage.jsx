import { RoutePlaceholder } from "../../components/common";

/**
 * Materials inventory page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const MaterialsPage = () => {
  return (
    <RoutePlaceholder
      title="Materials"
      description="Manage inventory, stock levels, and material resources."
      routePath="/dashboard/materials"
    />
  );
};

export default MaterialsPage;
