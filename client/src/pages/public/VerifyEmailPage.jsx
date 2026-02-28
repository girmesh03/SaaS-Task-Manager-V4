import { RoutePlaceholder } from "../../components/common";

/**
 * Email verification page placeholder.
 *
 * @returns {JSX.Element} Page placeholder element.
 * @throws {never} This component does not throw.
 */
const VerifyEmailPage = () => {
  return (
    <RoutePlaceholder
      title="Verify Email"
      description="Confirm your email address to activate your account."
      routePath="/verify-email"
      minimal
    />
  );
};

export default VerifyEmailPage;
