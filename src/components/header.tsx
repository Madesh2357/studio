import { Waves } from 'lucide-react';

export function Header() {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-primary rounded-lg">
        <Waves className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
        OceanGuard
      </h1>
    </div>
  );
}
