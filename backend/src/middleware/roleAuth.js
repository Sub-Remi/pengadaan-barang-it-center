export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Specific role middlewares
export const requirePemohon = requireRole(['pemohon']);
export const requireAdmin = requireRole(['admin']);
export const requireValidator = requireRole(['validator']);
export const requireAdminOrValidator = requireRole(['admin', 'validator']);