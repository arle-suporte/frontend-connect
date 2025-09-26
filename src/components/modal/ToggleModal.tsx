"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ToggleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
    isToggleEnabled: boolean;
    onToggleChange: (checked: boolean) => void;
    toggleLabel: string;
}

export default function ToggleModal({
    open,
    onOpenChange,
    title,
    icon: Icon,
    description,
    isToggleEnabled,
    onToggleChange,
    toggleLabel,
}: ToggleModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] gap-6">
                <DialogHeader className="text-center space-y-4">
                    {Icon && (
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
                            <Icon className="w-8 h-8 text-primary" />
                        </div>
                    )}
                    <DialogTitle className="text-xl font-semibold flex justify-center">
                        {title}
                    </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {description && (
                        <p className="text-sm text-foreground text-center leading-relaxed">
                            {description}
                        </p>
                    )}
                    
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <Label 
                            htmlFor="toggle-switch" 
                            className="text-sm font-medium cursor-pointer"
                        >
                            {toggleLabel}
                        </Label>
                        <Switch
                            id="toggle-switch"
                            checked={isToggleEnabled}
                            onCheckedChange={onToggleChange}
                            aria-label={toggleLabel}
                            className="cursor-pointer"
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}