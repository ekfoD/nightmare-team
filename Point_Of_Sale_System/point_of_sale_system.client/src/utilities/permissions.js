import { ROLE_HIERARCHY } from "../config/access";

export const hasAccess = ({
  userRole,
  businessType,
  businessId,
  minRole,
  allowedBusiness,
  requireBusiness = false,
}) => {
  if (!userRole) return false;

  const userLevel = ROLE_HIERARCHY.indexOf(userRole.toLowerCase());
  const requiredLevel = ROLE_HIERARCHY.indexOf(minRole.toLowerCase());

  if (userLevel < requiredLevel) return false;

  if (requireBusiness && !businessId) return false;

  if (
    allowedBusiness &&
    !allowedBusiness.includes(businessType)
  ) {
    return false;
  }

  return true;
};
