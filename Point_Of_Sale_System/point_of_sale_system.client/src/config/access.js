export const ROLES = {
  EMPLOYEE: "employee",
  MANAGER: "manager",
  OWNER: "owner",
  ADMIN: "admin",
};

export const BUSINESS_TYPES = {
  SERVICE: "service",
  RESTAURANT: "restaurant",
};

export const ROLE_HIERARCHY = [
  ROLES.EMPLOYEE,
  ROLES.MANAGER,
  ROLES.OWNER,
  ROLES.ADMIN,
];

export const ROUTE_RULES = {
  inventory: {
    minRole: ROLES.MANAGER,
    business: [BUSINESS_TYPES.RESTAURANT],
  },
  menuManagement: {
    minRole: ROLES.MANAGER,
    business: [BUSINESS_TYPES.RESTAURANT],
  },
  orderHistory: {
    minRole: ROLES.EMPLOYEE,
    business: [BUSINESS_TYPES.RESTAURANT],
  },
  services: {
    minRole: ROLES.EMPLOYEE,
    business: [BUSINESS_TYPES.SERVICE],
  },
  schedule: {
    minRole: ROLES.EMPLOYEE,
    business: [BUSINESS_TYPES.SERVICE],
  },
  appHistory: {
    minRole: ROLES.EMPLOYEE,
    business: [BUSINESS_TYPES.SERVICE],
  },
};
