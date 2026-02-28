import { RoutePlaceholder } from "../../components/common";

/**
 * Login page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const LoginPage = () => {
  return (
    <RoutePlaceholder
      title="Login"
      description="Sign in to your TaskManager account."
      routePath="/login"
      minimal
    />
  );
};

export default LoginPage;
