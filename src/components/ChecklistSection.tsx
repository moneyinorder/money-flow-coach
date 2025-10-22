import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, CheckCheck } from "lucide-react";

interface ChecklistSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  colorScheme: "foundation" | "growth" | "optimize";
  icon?: ReactNode;
  completedCount: number;
  totalCount: number;
  onMarkAllComplete: () => void;
}

export const ChecklistSection = ({
  title,
  subtitle,
  children,
  colorScheme,
  icon,
  completedCount,
  totalCount,
  onMarkAllComplete,
}: ChecklistSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const allComplete = completedCount === totalCount;

  return (
    <section
      className={cn(
        "py-8 px-6 rounded-3xl transition-colors duration-300",
        colorScheme === "foundation" && "bg-section-foundation",
        colorScheme === "growth" && "bg-section-growth",
        colorScheme === "optimize" && "bg-section-optimize"
      )}
    >
      <div className="max-w-3xl mx-auto">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4 flex-1">
                {icon && (
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 flex-shrink-0">
                    {icon}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-3xl font-bold text-foreground mb-2">{title}</h2>
                  {subtitle && (
                    <p className="text-muted-foreground text-lg">{subtitle}</p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {completedCount} of {totalCount} items complete
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onMarkAllComplete}
                  disabled={allComplete}
                  className="whitespace-nowrap"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All Complete
                </Button>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <ChevronDown 
                      className={cn(
                        "h-5 w-5 transition-transform duration-200",
                        !isOpen && "-rotate-90"
                      )}
                    />
                    <span className="sr-only">Toggle section</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="space-y-4">{children}</div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </section>
  );
};
