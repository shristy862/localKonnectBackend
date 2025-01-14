export const verifySecurityCode = (req, res, next) => {
  
    const { securityCode } = req.body;
    const requiredSecurityCode = 'abcde';
  
    if (!securityCode || securityCode !== requiredSecurityCode) {
      return res.status(403).json({ message: 'Invalid security code' });
    }
  
    next();
};
