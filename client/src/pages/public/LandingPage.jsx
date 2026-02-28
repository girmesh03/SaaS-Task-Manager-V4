import { RoutePlaceholder } from "../../components/common";

/**
 * Landing page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const LandingPage = () => {
  return (
    <RoutePlaceholder
      title="Landing Page"
      description="Welcome to TaskManager - Your organizational task management solution."
      routePath="/"
      minimal
    />
  );
};

export default LandingPage;
