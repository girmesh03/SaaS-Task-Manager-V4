import { RoutePlaceholder } from "../../components/common";

/**
 * Reset password page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const ResetPasswordPage = () => {
  return (
    <RoutePlaceholder
      title="Reset Password"
      description="Set a new password for your account."
      routePath="/reset-password"
      minimal
    />
  );
};

export default ResetPasswordPage;
