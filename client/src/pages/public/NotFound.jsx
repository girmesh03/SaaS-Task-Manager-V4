import { RoutePlaceholder } from "../../components/common";

/**
 * Not found page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const NotFound = () => {
  return (
    <RoutePlaceholder
      title="404 - Not Found"
      description="The page you are looking for does not exist."
      routePath="*"
      minimal
    />
  );
};

export default NotFound;
