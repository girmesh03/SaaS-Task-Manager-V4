import { RoutePlaceholder } from "../../components/common";

/**
 * Registration page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const RegisterPage = () => {
  return (
    <RoutePlaceholder
      title="Register"
      description="Create a new TaskManager account for your organization."
      routePath="/register"
      minimal
    />
  );
};

export default RegisterPage;
