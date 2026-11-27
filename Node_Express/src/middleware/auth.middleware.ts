import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// Extend the Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  // Extract the Authorization header
  const authHeader = req.headers["authorization"];

  // Extract the token (format: "Bearer TOKEN")
  const token = authHeader && authHeader.split(" ")[1];

  // If there's no token, reject the request
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Store the user info in the request object
    req.user = decoded as { id: number; role: string };

    // Pass control to the next middleware/controller
    next();
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // First check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  // Check if user has admin role
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}

export function requireSelectedUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  if (Number(req.params.id) !== req.user.id || req.user.role !== "admin") {
    return res.status(403).json({
        message: "No access"
    })
  }
  
  next();
}
