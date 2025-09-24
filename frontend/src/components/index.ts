/**
 * Central components export for faster compilation
 * Import commonly used components from here instead of deep paths
 */

// Most frequently used UI components (reduces deep imports)
export { Button } from './ui/base/button';
export { Input } from './ui/base/input';
export { Label } from './ui/base/label';
export { Card, CardContent, CardHeader, CardTitle } from './ui/base/card';
export { Badge } from './ui/base/badge';
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/feedback/tooltip';
export { Separator } from './ui/base/separator';
export { ThemeToggle } from './ui/navigation/theme-toggle';

// Layout components
export { default as StarBorder } from './ui/layout/star-border';
export { Brand } from './ui/layout/brand';
export { CryageLogo } from './ui/layout/cryage-logo';

// Feature-based exports (import specific components as needed)
// Remove wildcard exports to speed up compilation

// Common components
export * from './common';
