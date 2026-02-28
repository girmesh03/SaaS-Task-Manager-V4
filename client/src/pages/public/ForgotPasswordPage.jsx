import { RoutePlaceholder } from "../../components/common";

/**
 * Forgot password page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const ForgotPasswordPage = () => {
  return (
    <RoutePlaceholder
      title="Forgot Password"
      description="Request password reset link via email."
      routePath="/forgot-password"
      minimal
    />
  );
};

export default ForgotPasswordPage;
