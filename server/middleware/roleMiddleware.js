export const ownerOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (req.user.role !== 'hotelOwner') {
      return res.status(403).json({ success: false, message: 'Access denied: hotel manager only' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authorization failed' });
  }
};
