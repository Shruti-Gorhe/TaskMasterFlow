import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Bell, Flag, Download, Zap } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: CalendarPlus,
      label: "Add Event",
      color: "bg-mint/10 hover:bg-mint/20 text-mint",
      onClick: () => {
        // TODO: Implement add event functionality
        console.log("Add event clicked");
      },
    },
    {
      icon: Bell,
      label: "Set Reminder",
      color: "bg-lavender/10 hover:bg-lavender/20 text-lavender",
      onClick: () => {
        // TODO: Implement reminder functionality
        if ("Notification" in window) {
          Notification.requestPermission();
        }
      },
    },
    {
      icon: Flag,
      label: "Mark Priority",
      color: "bg-coral/10 hover:bg-coral/20 text-coral",
      onClick: () => {
        // TODO: Implement priority marking
        console.log("Mark priority clicked");
      },
    },
    {
      icon: Download,
      label: "Export Tasks",
      color: "bg-sky/10 hover:bg-sky/20 text-sky",
      onClick: () => {
        // TODO: Implement export functionality
        console.log("Export tasks clicked");
      },
    },
  ];

  return (
    <Card className="card-bloom shadow-xl border-pink-200/40 dark:border-purple-500/30">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold text-gray-800 dark:text-gray-100">
          <Zap className="w-6 h-6 text-lemon mr-2 animate-float" />
          Quick Actions ⚡
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={action.onClick}
              className={`p-3 ${action.color} transition-colors group h-auto flex-col space-y-1`}
            >
              <action.icon className="text-lg group-hover:scale-110 transition-transform" />
              <div className="text-xs font-medium text-gray-700">{action.label}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
